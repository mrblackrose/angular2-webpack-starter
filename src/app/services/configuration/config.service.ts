import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { EnvironmentConfig } from '../../common/models/environmentConfig.interface';

@Injectable()
export class ConfigService {
    config: EnvironmentConfig;
    constructor(private http: Http) {
    }

    load() {
        return new Promise((resolve) => {
            this.http.get('config.json').map(res => res.json())
                .subscribe(config => {
                    this.config = config;
                    resolve();
                });
        });
    }
}