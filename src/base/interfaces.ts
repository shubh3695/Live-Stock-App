import { CONTEXT_TYPE } from './enums';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

/** Contains a list of defined types which shall be used for implementation purposes
 */

export interface IStockData {
    name: string;
    price: number;
}

export interface IStockContent {
    timestamp?: number;
    current?: number;
    chartData?: number[];
    chartLabels?: string[];
    max?: number;
    min?: number;
    prev?: number;
}

export interface IStockDisplay {
    context: CONTEXT_TYPE;
    chartData?: ChartDataSets;
    chartLabels?: Label[];
}
