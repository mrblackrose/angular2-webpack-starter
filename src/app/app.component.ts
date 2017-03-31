/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AdalService } from 'ng2-adal/core';
import { AppState } from './app.service';
import { ConfigService } from './services/configuration/config.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
     <div [ngSwitch]="adalService.userInfo.isAuthenticated">
          <p *ngSwitchCase="false">{{userInfo.loginError || 'Authenticating...'}}</p>
          <main class="container-fluid">
              <router-outlet></router-outlet>
          </main>
      </div>
  `
})
export class AppComponent implements OnInit {
  constructor(
    public appState: AppState,
    private adalService: AdalService,
    private configService: ConfigService
  ) { 
    this.adalService.init(this.configService.adalConfig);
    this.adalService.handleWindowCallback();
    this.adalService.getUser();
    if (!this.adalService.userInfo.isAuthenticated) {
      this.adalService.login();
    }
  }

  public ngOnInit() {

  }
}