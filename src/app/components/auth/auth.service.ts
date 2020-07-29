import {HttpClient, HttpErrorResponse, HttpHeaders,} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Token } from './tokens';

import { environment } from 'src/environments/environment';
import { GeneralService } from '../base/general.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const API_BASE_URL = environment.api_url;
const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private generalService: GeneralService) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(error);
  }

  login(code: string): Observable<Token> {
    return this.http
      .post<Token>(
        API_BASE_URL + '/auth/login/',
        {
          code: code,
        },
        httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  refreshToken(refresh_token: string): Observable<Token> {
    return this.http
      .post<Token>(
        API_BASE_URL + '/auth/refresh/',
        {
          refresh_token: refresh_token,
        },
        httpOptions
      )
      .pipe(catchError(this.handleError));
    }

  isLoggedIn() {
    return localStorage.getItem('access_token') != null;
  }

  setUserProfile(): Observable<any> {
    return this.generalService.get('/user/profile/', {});
  }

  getClusterDomain(): Observable<any> {
    return this.generalService.get(`/user/domain/`, {}); 
  }

  getFyleOrgs(): Observable<any> {
    return this.generalService.get(`/user/orgs/`, {});
  }

  logout() {
    localStorage.clear();
  }

  redirectToLogin() {
    window.location.href =
    FYLE_URL +
    '/app/developers/#/oauth/authorize?' +
    'client_id=' +
    FYLE_CLIENT_ID +
    '&redirect_uri=' +
    CALLBACK_URI +
    '&response_type=code';
  }

  switchWorkspace() {
    this.logout();
    this.redirectToLogin();
  }
}
