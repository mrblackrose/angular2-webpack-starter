import {Injectable, Inject} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ConfigService {
    public config: any;

    constructor(){
    }

    public get adalConfig(): any {
        return {
            tenant: 'microsoft.onmicrosoft.com',
            clientId: '5fe3f443-8ad1-47ce-8599-82aa50ba97f0',
            redirectUri: window.location.href,
            postLogoutRedirectUri: window.location.href
        };
    }
}