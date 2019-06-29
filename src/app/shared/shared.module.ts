import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {
    MatButtonModule, MatCheckboxModule,
    MatCardModule, MatInputModule,
    MatGridListModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ChartsComponent } from './charts/charts.component';
@NgModule({
    imports: [CommonModule, BrowserModule, MatButtonModule, MatCheckboxModule,
        MatCardModule, MatInputModule, MatGridListModule,
        ChartsModule],
    declarations: [ChartsComponent],
    exports: [MatButtonModule, MatCheckboxModule,
        MatCardModule, MatInputModule,
        MatGridListModule, ChartsComponent],
})
export class SharedModule { }
