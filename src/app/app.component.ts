import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/services/app.service';
import { SOCKET_CONNECTION } from 'src/base/enums';

/**
 * AppComponent
 * Root Component Acting as a container
 * Handles
 * 1. Header
 * 2. Sub Components and displays
 * 3. Does 2 way interaction to obtain the status of WS connection
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public status: SOCKET_CONNECTION = SOCKET_CONNECTION.RUNNING;

  constructor(private appService: AppService) {
  }

  public ngOnInit() {
    this._manageSocketConection();
  }

  public socketServiceContext() {
    if (this.status === SOCKET_CONNECTION.DISCONNECTED) {
      /* If I was disconnected, send a signal to restart -- > StockContentComponent*/
      this.appService.websocketAction$().next(SOCKET_CONNECTION.RESTART);
    } else {
      // I doubt if I need to do anything ova here?
    }
  }

  public ngOnDestroy() {
  }
  private _manageSocketConection() {
    /* Obtaining Status of the socket service from Child component
      using Subject */
    this.appService.websocketStatus$()
      .subscribe((status) => {
        this.status = status;
      });
  }
}
