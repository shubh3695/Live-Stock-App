import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WebsocketService } from 'src/services/socket.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { IStockContent, IStockData } from 'src/base/interfaces';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import { AppService } from 'src/services/app.service';

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
  public lineChartLabel: Label[] = [];
  public lineChartData: ChartDataSets[] = [];
  private currentStock: string;
  /*Side Chart Data Ends Here */

  private currentTime: number;
  constructor(private stockService: WebsocketService, private appService: AppService) { }

  public ngOnInit() {
    this.appService.initChart();
    this.stockService.connect(environment.ws_url).pipe(map((res) => res))
      .subscribe({
        next: (responses) => {
          if (responses && responses.length > 0) {
            responses.forEach((response) => {
              this.currentTime = moment.now();
              this._resolveStockContent(response);
            });
          }
          console.log(responses);
        },
        error: (err) => console.log(err),
        complete: () => console.log('Connection Terminated')
      });
  }

  public loadStockChart(key: string) {
    this.currentStock = key;
    this.appService.renewChartData({ data: this.stockContent[key].chartData, label: key, yAxisID: 'y-axis-0' },
      this.stockContent[key].chartLabels);
  }
  public resetStockHistory() {
    this.stockContent = {};
    this.originalSource = {};
  }

  public searchStockQuery(query: any) {
    console.log(query.target.value);
  }

  public getDifference(current: number, previous: number) {
    const _DELTA = Number(current - previous).toFixed(2);
    return +_DELTA + ' (' + Number(((+_DELTA) * 100) / previous).toFixed(2) + '%)';
  }

  public getTimeDifference(time) {
    return Number((this.currentTime - time) / 1000).toFixed(0) + ' seconds ago';
  }
  private _resolveStockContent(response: IStockData) {
    response[1] = Number(response[1]).toFixed(2);
    const _STOCK: IStockContent = {
      prev: this.stockContent[response[0]] ? this.stockContent[response[0]].current : +response[1],
      current: +response[1],
      timestamp: this.currentTime,
      chartData: this._resolveGraphData(response),
      chartLabels: this._resolveGraphLabels(response),
      max: Math.max(this.stockContent[response[0]] && this.stockContent[response[0]].max || -Infinity, +response[1]),
      min: Math.min(this.stockContent[response[0]] && this.stockContent[response[0]].min || Infinity, +response[1]),
    };
    this.stockContent[response[0]] = _STOCK;
    if (this.currentStock === response[0]) {
      console.log(this.currentTime + ' ' + response[0]);
      this.appService.pushChartData({ data: response[1] }, [this._getFormattedDate()]);
    }
  }

  private _resolveGraphLabels(response: IStockData) {
    if (this.stockContent[response[0]]) {
      this.stockContent[response[0]].chartLabels.push(this._getFormattedDate());
      return this.stockContent[response[0]].chartLabels;
    } else {
      return [this._getFormattedDate()];
    }
  }
  private _resolveGraphData(response: IStockData): Array<number> {
    if (this.stockContent[response[0]]) {
      this.stockContent[response[0]].chartData.push(+response[1]);
      return this.stockContent[response[0]].chartData;
    } else {
      return [+response[1]];
    }
  }

  private _getFormattedDate() {
    return moment(this.currentTime).format('h:mm:ss a');
  }
  public ngOnDestroy() {
    this.stockService.close();
  }
}
