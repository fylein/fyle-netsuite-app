import {
  HttpClient,
  HttpErrorResponse,  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { WindowReferenceService } from './window.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  windowReference: Window;

  constructor(private http: HttpClient, private storageService: StorageService, private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  private get apiBaseUrl(): string {
    return this.storageService.get('cluster-domain');
  }

  private logout(): void {
    console.error('apiBaseUrl not found, logging off user');
    this.storageService.clear();
    this.windowReference.location.href = FYLE_URL +
    '/app/developers/#/oauth/authorize?' +
    'client_id=' +
    FYLE_CLIENT_ID +
    '&redirect_uri=' +
    CALLBACK_URI +
    '&response_type=code';
  }

  private handleError(error: HttpErrorResponse, httpMethod: string) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status >= 500 && httpMethod === 'GET') {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
        );
      } else if (error.status >= 400 && httpMethod === 'POST') {
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
        );
      }
    }
    return throwError(error);
  }
  // Having any here is ok
  post(endpoint: string, body: {}, baseUrl?: string): Observable<any> {
    const apiBaseUrl = baseUrl ? baseUrl : this.apiBaseUrl;
    if (!apiBaseUrl) {
      this.logout();
    }
    return this.http
      .post(
        apiBaseUrl + endpoint,
        body,
        httpOptions
      )
      .pipe(catchError(error => {
        return this.handleError(error, 'POST');
      }));
  }
  patch(endpoint: string, body: {}): Observable<any> {
    if (!this.apiBaseUrl) {
      this.logout();
    }
    return this.http
      .patch(
        this.apiBaseUrl + endpoint,
        body,
        httpOptions
      )
      .pipe(catchError(error => {
        return this.handleError(error, 'PATCH');
      }));
  }
  // Having any here is ok
  get(endpoint: string, apiParams: {}): Observable<any> {
    if (!this.apiBaseUrl) {
      this.logout();
    }
    let params = new HttpParams();
    Object.keys(apiParams).forEach(key => {
      params = params.set(key, apiParams[key]);
    });

    return this.http.get(
      this.apiBaseUrl + endpoint,
        {params}
      )
      .pipe(catchError(error => {
        return this.handleError(error, 'GET');
      }));
  }
}
