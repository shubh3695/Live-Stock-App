import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/services/socket.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IStockContent, IStockData } from 'src/base/interfaces';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppService } from 'src/services/app.service';
import { SOCKET_CONNECTION } from 'src/base/enums';
/**
 *
 * Most important component of the SPA
 * 1. Displays cards
 * 2. Shares Data with the third party chart module
 * 3. Handles and Navigates Context, Content and Data
 * @export
 * @class StockContentComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-stock-content',
  templateUrl: './stock-content.component.html',
  styleUrls: ['./stock-content.component.scss']
})

export class StockContentComponent implements OnInit, OnDestroy {

  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    suppressScrollY: false
  };
  public stockContent: { [key: string]: IStockContent } = {};
  public originalSource: { [key: string]: IStockContent } = {};
  public visibleStocks = false;
  /* private variables start here*/
  private currentStock: string;
  public searchQuery: string;
  private currentTime: number;
  /* private variables end here*/
  constructor(private stockService: WebsocketService, private appService: AppService) { }

  /**
   * Init Life Cycle Hook
   * 1. Create WS Connection
   * 2. Keeps an eye on status of actions of connection
   * @memberof StockContentComponent
   */
  public ngOnInit() {

    this.appService.initChart();
    this._createConnection();
    this.appService.websocketAction$()
      .subscribe((action) => {
        if (action === SOCKET_CONNECTION.RESTART) {
          this._createConnection();
        }
      });
  }

  /**
   * Creates Stock Chart with this particular key
   * @param key : load stock chart with this particular stock key i.e. name
   * @memberof StockContentComponent
   */
  public loadStockChart(key: string) {
    if (this.currentStock === key) {
      // chart already loaded
      return;
    }
    this.currentStock = key;
    this.appService.renewChartData({ data: this.stockContent[key].chartData, label: key },
      this.stockContent[key].chartLabels);
  }

  /**
   * Resets the page afresh
   * @memberof StockContentComponent
   */
  public resetStockHistory() {
    this.visibleStocks = false;
    this.searchQuery = '';
    this.originalSource = {};
    this.stockContent = {};
    this.currentStock = undefined;
    this.appService.initChart();
  }

  /**
   * Filters the stocks to be displayed
   *  with this particular input value
   * @param query : search param
   * @memberof StockContentComponent
   */
  public searchStockQuery(query: string) {
    this.searchQuery = query;
    this._naiveFilterContents();
  }

  /**
   * Returns human readable form of stock price
   * @param current : current stock price
   * @param previous previous stock price
   * @memberof StockContentComponent
   */
  public getDifference(current: number, previous: number) {
    const _DELTA = Number(current - previous).toFixed(2);
    return +_DELTA + '$ (' + Number(((+_DELTA) * 100) / previous).toFixed(2) + '%)';
  }

  /**
   * Returns human readable last updated stock time
   * @param time time when stock was last updated
   * @memberof StockContentComponent
   */
  public getTimeDifference(time: number) {
    return Number((this.currentTime - time) / 1000).toFixed(0) + ' seconds ago';
  }

  /**
   * Simply keeps track which item to modify via index
   * distinct modifier
   * @param index : index
   * @param item : item at index
   */
  public dataTracker(index, item) {
    return index;
  }
  public ngOnDestroy() {
    // close this websocket connection of the component is destroyed
    this.stockService.close();
  }

  /* Private Functions start here */

  /**
   * function assigns new response of stock data
   * into map of objects
   * @param response : new response emitted via rxjs
   */
  private _resolveStockContent(response: IStockData) {
    response[1] = Number(response[1]).toFixed(2);
    const _STOCK: IStockContent = {
      prev: this.originalSource[response[0]] ? this.originalSource[response[0]].current : +response[1],
      current: +response[1],
      timestamp: this.currentTime,
      chartData: this._resolveGraphData(response),
      chartLabels: this._resolveGraphLabels(response),
      max: Math.max(this.originalSource[response[0]] && this.originalSource[response[0]].max || -Infinity, +response[1]),
      min: Math.min(this.originalSource[response[0]] && this.originalSource[response[0]].min || Infinity, +response[1]),
    };
    this.originalSource[response[0]] = _STOCK;
    if (this.currentStock === response[0]) {
      /* make sure this new object is also pushed into the data of chart
          if this was my current stock dispalyed
      */
      this.appService.pushChartData({ data: response[1] }, [this._getFormattedDate()]);
    }
  }

  /**
   * Returns new chart labels after inserting into
   * corresponding to this key
   * @param response response data from WS
   * @memberof StockContentComponent
   */
  private _resolveGraphLabels(response: IStockData) {
    if (this.originalSource[response[0]]) {
      this.originalSource[response[0]].chartLabels.push(this._getFormattedDate());
      return this.originalSource[response[0]].chartLabels;
    } else {
      return [this._getFormattedDate()];
    }
  }

  /**
   * Returns new chart data after inserting
   * corresponding to this key
   * @param response response data from WS
   * @memberof StockContentComponent
   */
  private _resolveGraphData(response: IStockData): Array<number> {
    if (this.originalSource[response[0]]) {
      this.originalSource[response[0]].chartData.push(+response[1]);
      return this.originalSource[response[0]].chartData;
    } else {
      return [+response[1]];
    }
  }

  /**
   * Simple Date Formatter
   * @memberof StockContentComponent
   */
  private _getFormattedDate() {
    return moment(this.currentTime).format('h:mm:ss a');
  }

  /**
   * Initializes the connection with WS
   * @memberof StockContentComponent
   */
  private _createConnection() {
    this.appService.websocketStatus$().next(SOCKET_CONNECTION.RUNNING);
    this.stockService.connect(environment.ws_url).pipe(map((res) => res))
      .subscribe({
        next: (responses) => {
          if (responses && responses.length > 0) {
            responses.forEach((response) => {
              this.currentTime = moment.now();
              this._resolveStockContent(response);
            });
            this._naiveFilterContents();
          }
        },
        error: (err) => {
          this.appService.websocketStatus$().next(SOCKET_CONNECTION.DISCONNECTED);
          console.log(err);
        },
        complete: () => console.log('Connection Successfully Terminated.')
      });
  }

  /**
   * A very naive filter to show the search stock feature
   * Actual implementation should have
   * 1. TRIE Datastructure of current keys (OR)
   * 2. Search based on network requests
   * 3. Map
   * 4. Paginated service based search
   * @memberof StockContentComponent
   */
  private _naiveFilterContents() {
    if (!this.searchQuery) {
      this.visibleStocks = true;
      this.stockContent = this.originalSource;
      return;
    }
    this.stockContent = {};
    this.visibleStocks = false;
    for (const key in this.originalSource) {
      if (key.startsWith(this.searchQuery)) {
        this.stockContent[key] = this.originalSource[key];
        this.visibleStocks = true;
      }
    }
  }
}
