import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { ConfigService } from '../configuration/config.service';

@Injectable()
export class IDBServices {
    private endpoint: string;
    private clientCache = {};

    constructor(
        private configService: ConfigService,
        private http: ApiService,
        private router: Router) {
        this.endpoint = "http://localhost:8180";
    }

    public getConfiguration(): Observable<any> {
        return this.http.get(`${this.endpoint}/api/configuration`);
    }
}