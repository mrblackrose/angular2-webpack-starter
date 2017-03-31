/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject
} from '@angular/core';
import { AdalService } from 'ng2-adal/core';
import { AppState } from './app.service';
import { ConfigService } from './services/configuration/config.service';
import { EnvironmentConfig } from './common/models/environmentConfig.interface';

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
    this.adalService.init({      
        tenant: this.configService.config.aad.tenantId,
        clientId: this.configService.config.aad.clientId,
        redirectUri: window.location.href,
        postLogoutRedirectUri: window.location.href
    });
    this.adalService.handleWindowCallback();
    this.adalService.getUser();
    if (!this.adalService.userInfo.isAuthenticated) {
      this.adalService.login();
    }
  }

  public ngOnInit() {

  }
}