import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IStockDisplay } from 'src/base/interfaces';
import { CONTEXT_TYPE, SOCKET_CONNECTION } from 'src/base/enums';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

/**
 * A Dependency Injection to handle internal data transfer 
 * This acts as a single point of resource for all connections between
 * multiple child node components
 * @export
 * @class AppService
 */

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor() { }

    private socketActionContext: Subject<SOCKET_CONNECTION> = new Subject();
    private socketStatusContext: Subject<SOCKET_CONNECTION> = new Subject();
    private chartSubject: Subject<IStockDisplay> = new Subject();

    /**
     * Chart Content is propogated via this.
     */
    public handleChartContent$() {
        return this.chartSubject;
    }

    /**
     * Web Socket Activities are propogated via this.
     */
    public websocketAction$() {
        return this.socketActionContext;
    }

    /**
     * Web Socket Notifications are propogated via this.
     */
    public websocketStatus$() {
        return this.socketStatusContext;
    }

    /**
     * Initialize Chart Content
     */
    public initChart() {
        this.chartSubject.next({ context: CONTEXT_TYPE.INIT });
    }

    /**
     * append data for this chart data
     * @param chartData chart data sets
     * @param chartLabels chart label data
     */
    public pushChartData(chartData: ChartDataSets, chartLabels: Label[]) {
        this.chartSubject.next({ context: CONTEXT_TYPE.APPEND, chartData, chartLabels });
    }
    
    /**
     * insert a new chart data set
     * @param chartData new chart data sets
     * @param chartLabels new chart data labels
     */
    public renewChartData(chartData: ChartDataSets, chartLabels: Label[]) {
        this.chartSubject.next({ context: CONTEXT_TYPE.NEW_STOCK, chartData, chartLabels });
    }
}
