import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/services/socket.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IStockContent, IStockData } from 'src/base/interfaces';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppService } from 'src/services/app.service';
import { timer } from 'rxjs';
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
  /* Side Chart Data Starts Here*/
  private currentStock: string;
  /*Side Chart Data Ends Here */
  public searchQuery: string;
  private currentTime: number;
  constructor(private stockService: WebsocketService, private appService: AppService) { }

  public ngOnInit() {
    this.appService.initChart();
    this._createConnection();
  }

  public loadStockChart(key: string) {
    if (this.currentStock === key) {
      this.appService.initChart();
      this.currentStock = undefined;
    }
    this.currentStock = key;
    this.appService.renewChartData({ data: this.stockContent[key].chartData, label: key },
      this.stockContent[key].chartLabels);
  }
  public resetStockHistory() {
    this.originalSource = {};
    this.stockContent = {};
    this.currentStock = undefined;
    this.appService.initChart();
  }

  public searchStockQuery(query: string) {
    this.searchQuery = query;
    this._filterDisplayContents();
  }

  public getDifference(current: number, previous: number) {
    const _DELTA = Number(current - previous).toFixed(2);
    return +_DELTA + '$ (' + Number(((+_DELTA) * 100) / previous).toFixed(2) + '%)';
  }

  public getTimeDifference(time: number) {
    return Number((this.currentTime - time) / 1000).toFixed(0) + ' seconds ago';
  }

  public ngOnDestroy() {
    this.stockService.close();
  }

  /* Private Functions start here */

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
      this.appService.pushChartData({ data: response[1] }, [this._getFormattedDate()]);
    }
  }

  private _resolveGraphLabels(response: IStockData) {
    if (this.originalSource[response[0]]) {
      this.originalSource[response[0]].chartLabels.push(this._getFormattedDate());
      return this.originalSource[response[0]].chartLabels;
    } else {
      return [this._getFormattedDate()];
    }
  }
  private _resolveGraphData(response: IStockData): Array<number> {
    if (this.originalSource[response[0]]) {
      this.originalSource[response[0]].chartData.push(+response[1]);
      return this.originalSource[response[0]].chartData;
    } else {
      return [+response[1]];
    }
  }

  private _getFormattedDate() {
    return moment(this.currentTime).format('h:mm:ss a');
  }

  private _createConnection() {
    this.stockService.connect(environment.ws_url).pipe(map((res) => res))
      .subscribe({
        next: (responses) => {
          if (responses && responses.length > 0) {
            responses.forEach((response) => {
              this.currentTime = moment.now();
              this._resolveStockContent(response);
            });
            this._filterDisplayContents();
          }
        },
        error: (err) => console.log(err),
        complete: () => console.log('Connection Terminated')
      });
  }

  private _filterDisplayContents() {
    if (!this.searchQuery) {
      this.stockContent = this.originalSource;
      return;
    }
    this.stockContent = {};
    for (const key in this.originalSource) {
      if (key.startsWith(this.searchQuery)) {
        this.stockContent[key] = this.originalSource[key];
      }
    }
  }
}
