import { Injectable } from '@angular/core';
import { AdalService } from 'ng2-adal/core';

@Injectable()
export class AdalHelperService {

    constructor(private adalService: AdalService) {

    }

    /**
     * Get bearer token
     */
    public getBearerToken(): Promise<string> {
        return new Promise<string>(resolve => {
            let token = this.adalService.getCachedToken(this.adalService.config.clientId);

            if (token) {
                resolve('Bearer ' + token);
            } else {
                this.adalService.acquireToken(this.adalService.config.clientId).subscribe((value: string) => {
                    resolve('Bearer ' + value);
                }, (error) => {
                    throw error;
                });
            }
        });
    }
}