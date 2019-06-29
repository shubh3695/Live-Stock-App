import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { IStockData } from 'src/base/interfaces';

@Injectable({
  providedIn: 'root'
}
)
export class WebsocketService {
  constructor() { }

  private subject: Subject<IStockData[]>;

  public connect(url): Subject<IStockData[]> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected to Stocks Websocket: ' + url);
    }
    return this.subject;
  }

  private create(url): Subject<IStockData[]> {
    return webSocket(url);
  }

  public close() {
    console.log('closing WS');
    this.subject.complete();
  }
}