import { Injectable } from '@angular/core';
import { Observable, Subscriber, Observer } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptionsArgs, RequestMethod, ResponseOptions } from '@angular/http';
import { AdalHelperService  } from './authentication/adal-helper.service';

@Injectable()
export class ApiService {

  constructor(
    private http: Http,
    private adalService: AdalHelperService) { }

  /**
   * Decorates the http get
   * @param {string} uriTemplate - Uri string with index based tokens for replacing values
   * @param {...any} uriValues - Values to use for the uriTemplate
   * @returns {Observable<any>} An observable for the call
   * @example
   * get('products/{0}/skus/{1}', 'surface', 1) or get('products/{0}/skus/{1}', ['surface', 1])
   * will call 'products/surface/skus/1'
   */
  get(urlTemplate: string, urlValues: any[] = null, suppressMessage: boolean = false): Observable<any> {
    return this.decorate(RequestMethod.Get, urlTemplate, urlValues, suppressMessage, (url, requestOptions) => {
      return this.http.get(url, requestOptions);
    });
  }

  /**
   * Decorates the http get
   * @param {string} uriTemplate - Uri string with index based tokens for replacing values
   * @param {any} postObject - The object to serialize for the post body
   * @param {...any} uriValues - Values to use for the uriTemplate
   * @returns {Observable<any>} An observable for the call
   */
  post(postObject: any, urlTemplate: string, urlValues: any[] = null, suppressMessage: boolean = false): Observable<any> {
    return this.decorate(RequestMethod.Post, urlTemplate, urlValues, suppressMessage, (url, requestOptions) => {
      return this.http.post(url, JSON.stringify(postObject), requestOptions);
    });
  }

  /**
   * Decorates the http put
   * @param {string} uriTemplate - Uri string with index based tokens for replacing values
   * @param {any} putObject - The object to serialize for the put body
   * @param {...any} uriValues - Values to use for the uriTemplate
   * @returns {Observable<any>} An observable for the call
   */
  put(putObject: any, urlTemplate: string, urlValues: any[] = null, suppressMessage: boolean = false): Observable<any> {
    return this.decorate(RequestMethod.Put, urlTemplate, urlValues, suppressMessage, (url, requestOptions) => {
      return this.http.put(url, JSON.stringify(putObject), requestOptions);
    });
  }

  /**
   * Decorates the http patch
   * @param {string} uriTemplate - Uri string with index based tokens for replacing values
   * @param {any} putObject - The object to serialize for the put body
   * @param {...any} uriValues - Values to use for the uriTemplate
   * @returns {Observable<any>} An observable for the call
   */
  patch(putObject: any, urlTemplate: string, urlValues: any[] = null, suppressMessage: boolean = false): Observable<any> {
    return this.decorate(RequestMethod.Put, urlTemplate, urlValues, suppressMessage, (url, requestOptions) => {
      return this.http.patch(url, JSON.stringify(putObject), requestOptions);
    });
  }


  /**
* Decorates the http delete
* @param {string} uriTemplate - Uri string with index based tokens for replacing values
* @param {...any} uriValues - Values to use for the uriTemplate
* @returns {Observable<any>} An observable for the call
* @example
* get('products/{0}/skus/{1}', 'surface', 1) or get('products/{0}/skus/{1}', ['surface', 1])
* will call 'products/surface/skus/1'
*/
  delete(urlTemplate: string, urlValues: any[] = null, suppressMessage: boolean = false): Observable<any> {
    return this.decorate(RequestMethod.Delete, urlTemplate, urlValues, suppressMessage, (url, requestOptions) => {
      return this.http.delete(url, requestOptions);
    });
  }

  /**
   * Decorator function that adds authorization headers, error handling and asimov logging
   * @private
   * @param {RequestMethod} requestMethod - Http request method being decorated for asimov logging
   * @param {string} uriTemplate - Uri string with index based tokens for replacing values
   * @param {...any} uriValues - Values to use for the uriTemplate
   * @param {(url: string, requesOptions: RequestOptionsArgs) => Observable<Response>)} decoratedFn - The function being decorated
   * @returns {Observable<any>} An observable that decorates the http calls
   */
  private decorate(requestMethod: RequestMethod, urlTemplate: string, urlValues: any[], suppressMessage: boolean, decoratedFn: (url: string, requesOptions: RequestOptionsArgs) => Observable<Response>): Observable<any> {
    var url = (urlValues) ? this.formatUrl(urlTemplate, urlValues) : urlTemplate;
    // Get the endpoint and correlation vector for logging        
    var endpoint: string;
    if (url.indexOf("//") > -1) {
      endpoint = url.split('/')[2];
    }
    else {
      endpoint = url.split('/')[0];
    }

    return Observable.fromPromise(this.adalService.getBearerToken())
      .map(authHeader => {
        var headers = {
          headers: new Headers({
            'Authorization': authHeader,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8'
          })
        };

        return headers;
      })
      .flatMap(requestOptions => decoratedFn(url, requestOptions))
      .map((response: Response) => {

        // Process the response
        if (response.text()) {
          try {
            return response.json();
          }
          catch (e) {
            //Return raw data if not json
            return response.text();
          }
        }
        else {
          return null;
        }
      }).catch((error: Response) => {
        // Return the decorated observable
        return Observable.throw(error);
      });
  }
  /**
   * 
  * Parses the template string and replaces the placeholders in it with the values array
  * @private
  * @param  {string} template with values like- /product/{0}/search/{1}
  * @param  {Array<string>} values
  * @returns {string} returns parsed template string
  */
  private formatUrl(template: string, values: any[]) {
    return template.replace(/{(\d+)}/g, function (result, d) {
      return values[d];
    });
  }
}
