import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { AppService } from 'src/services/app.service';
import { CONTEXT_TYPE } from 'src/base/enums';

/**
 * A reusable component that can be used anywhere in the application
 * where SharedModule is imported
 * <app-chart></app-chart> with an unique ID is enough
 * Receives Data from StockComponent when user selects a particular stock
 */
@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {
  @Input('id') public set id(id: string) {
    this.idVal = id;
  }
  /**
   * Static public variables required for Charts
   */
  public idVal: string;
  public lineChartData: ChartDataSets[] = [{ data: [], label: 'Select Stock' }];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: 'black'
          },
          scaleLabel: {
            display: true,
            labelString: 'Time',
            fontColor: 'black',
            fontFamily: 'Lato',
            fontSize: 16,
            fontStyle: 'bold'
          }
        }
      ],
      yAxes: [
        {
          position: 'left',
          gridLines: {
            color: 'rgba(0,0,0,0.4)',
          },
          ticks: {
            beginAtZero: true,
            fontColor: 'black',
          },
          scaleLabel: {
            fontColor: 'black',
            fontFamily: 'Lato',
            fontSize: 16,
            fontStyle: 'bold',
            display: true,
            labelString: 'Cost (USD)'
          }
        }
      ]
    }
  };

  public lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private appService: AppService) {

  }
  public ngOnInit() {
    /* handle a new chart data via subject */
    this.appService.handleChartContent$()
      .subscribe((result) => {
        switch (result.context) {
          case CONTEXT_TYPE.NEW_STOCK:
            this._renewChartNode(result.chartData, result.chartLabels);
            break;
          case CONTEXT_TYPE.APPEND:
            this._appendChartNode(result.chartData, result.chartLabels);
            break;
          case CONTEXT_TYPE.INIT:
            this._init();
        }
      });
  }

  /**
   * Simply feed empty data to the chart
   * @memberof ChartsComponent
   */
  private _init() {
    this.lineChartData = [{ data: [], label: 'Select Stock' }];
    this.lineChartLabels = [];
  }

  /**
   * Insert a new Stock into the chart
   * @param lineChartData line chart data set
   * @param lineChartLabels line chart labels which are simply dates
   * @memberof ChartsComponent
   */
  private _renewChartNode(lineChartData: ChartDataSets, lineChartLabels: Label[]) {
    this.lineChartData = [lineChartData];
    this.lineChartLabels = lineChartLabels;
  }

  /**
   * Append new single Data into existing graph
   * @param lineChartData insert this new data into existing data set
   * @param lineChartLabels insert a new label corresponding to the data set
   * @memberof ChartsComponent
   */
  private _appendChartNode(lineChartData: ChartDataSets, lineChartLabels: Label[]) {
    if (this.lineChartLabels[this.lineChartLabels.length - 1] !== lineChartLabels[0]) {
      this.lineChartData[0].data.push(lineChartData[0]);
      this.lineChartLabels.push(lineChartLabels[0]);
    }
  }

  /**
   * Life-cycle hook
   */
  public ngOnDestroy() {
  }
}
