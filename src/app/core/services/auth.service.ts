import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClusterDomainWithToken, Token } from '../models/tokens';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/core/services/api.service';
import { StorageService } from './storage.service';
import { WindowReferenceService } from './window.service';
import { UserProfile } from '../models/user-profile.model';
import { Organization } from '../models/organization.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const CALLBACK_URI = environment.callback_uri;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  windowReference: Window;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  private get apiBaseUrl(): string {
    return this.storageService.get('cluster-domain');
  }

  getClusterDomainByCode(code: string): Observable<ClusterDomainWithToken> {
    return this.apiService.post('/auth/cluster_domain/', { code }, environment.cluster_domain_api_url);
  }

  loginWithRefreshToken(refreshToken: string): Observable<Token> {
    return this.apiService.post('/auth/login_with_refresh_token/', { refresh_token: refreshToken });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(error);
  }

  getAccessToken(refreshToken: string): Observable<Token> {
    return this.http
      .post<Token>(
        this.apiBaseUrl + '/auth/refresh/',
        {
          refresh_token: refreshToken,
        },
        httpOptions
      )
      .pipe(
        catchError(
          this.handleError
        )
      );
  }

  isLoggedIn() {
    return this.storageService.get('access_token') !== null;
  }

  getUser() {
    return this.storageService.get('user');
  }

  getOrgCount() {
    return this.storageService.get('orgsCount');
  }

  getUserProfile(): Observable<UserProfile> {
    return this.apiService.get('/user/profile/', {});
  }

  getFyleOrgs(): Observable<Organization[]> {
    return this.apiService.get(`/user/orgs/`, {});
  }

  logout() {
    this.storageService.clear();
  }

  redirectToLogin() {
    this.windowReference.location.href = FYLE_URL +
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
