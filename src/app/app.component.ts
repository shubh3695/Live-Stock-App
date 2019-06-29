import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/services/app.service';
import { SOCKET_CONNECTION } from 'src/base/enums';

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
    this.appService.websocketStatus$()
      .subscribe((status) => {
        this.status = status;
      });
  }

  public socketServiceContext() {
    if (this.status === SOCKET_CONNECTION.DISCONNECTED) {
      this.appService.websocketAction$().next(SOCKET_CONNECTION.RESTART);
    } else {
      // I doubt if I need to do anything ova here?
    }
  }

  public ngOnDestroy() {
  }
}
