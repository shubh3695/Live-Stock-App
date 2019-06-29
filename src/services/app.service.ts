import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IStockDisplay } from 'src/base/interfaces';
import { CONTEXT_TYPE } from 'src/base/enums';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor() { }

    private chartSubject: Subject<IStockDisplay> = new Subject();

    public handleChartContent$() {
        return this.chartSubject;
    }
    public initChart() {
        this.chartSubject.next({context: CONTEXT_TYPE.INIT});
    }
    public pushChartData(chartData: ChartDataSets, chartLabels: Label[]) {
        this.chartSubject.next({ context: CONTEXT_TYPE.APPEND, chartData, chartLabels });
    }
    public renewChartData(chartData: ChartDataSets, chartLabels: Label[]) {
        this.chartSubject.next({ context: CONTEXT_TYPE.NEW_STOCK, chartData, chartLabels });
    }
}