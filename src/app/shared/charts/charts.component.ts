import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { AppService } from 'src/services/app.service';
import { CONTEXT_TYPE } from 'src/base/enums';

@Component({
  selector: 'app-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {

  @Input('id') public set id(id: string) {
    this.idVal = id;
  }
  public idVal: string;
  public lineChartData: ChartDataSets[] = [
    { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-0' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions) = {
    // responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'rgba(0,0,0,0.8)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
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
    this.appService.handleChartContent$()
      .subscribe((result) => {
        switch (result.context) {
          case CONTEXT_TYPE.RENEW:
            this._renewChartNode(result.chartData, result.chartLabels);
            break;
          case CONTEXT_TYPE.APPEND:
            this._appendChartNode(result.chartData, result.chartLabels);
            break;
        }
      });
  }

  private _renewChartNode(lineChartData: ChartDataSets, lineChartLabels: Label[]) {
    this.lineChartData = [lineChartData];
    this.lineChartLabels = lineChartLabels;
  }

  private _appendChartNode(lineChartData: ChartDataSets, lineChartLabels: Label[]) {
    if (this.lineChartLabels[this.lineChartLabels.length - 1] !== lineChartLabels[0]) {
      this.lineChartData[0].data.push(lineChartData[0]);
      this.lineChartLabels.push(lineChartLabels[0]);
    }
  }
  public ngOnDestroy() {
  }
}
