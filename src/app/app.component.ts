import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/services/app.service';
import { SOCKET_CONNECTION } from 'src/base/enums';
import { fromEvent as observableFromEvent } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
    this.onlineNotifier();
  }

  /**
   * Although it will be auto handled but
   * due to limited connection it breaks out
   * then manual intervention will work
   */
  public socketServiceContext() {
    if (this.status === SOCKET_CONNECTION.DISCONNECTED) {
      /* If I was disconnected, send a signal to restart -- > StockContentComponent*/
      this.appService.websocketAction$().next(SOCKET_CONNECTION.RESTART);
    } else {
      // I doubt if I need to do anything ova here?
    }
  }

  /**
   * Chrome rebinds to the WS network if net off,
   * but firefox WS needs to be reconnected.
   * Making sure action of both browsers is same
   * @readonly
   * @memberof AppComponent
   */
  public onlineNotifier() {
    observableFromEvent(window, 'offline')
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        console.log(String.fromCodePoint(0x1F621) + ' You went offline ' + String.fromCodePoint(0x1F621));
        this.status = SOCKET_CONNECTION.DISCONNECTED;
      });

    observableFromEvent(window, 'online')
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        console.log(String.fromCodePoint(0x1F60A) + ' Back online ' + String.fromCodePoint(0x1F60A));
        this.appService.websocketAction$().next(SOCKET_CONNECTION.RESTART);
      });
  }

  public ngOnDestroy() {
    // app component destroyed'
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
