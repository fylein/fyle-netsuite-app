import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BillsService } from '../services/bills.service';
import { SettingsService } from '../services/settings.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { WorkspaceService } from '../services/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private billsService: BillsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private workspaceService: WorkspaceService
    ) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const workspaceId = +this.workspaceService.getWorkspaceId();

    if (!workspaceId) {
      return this.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
    }

    return forkJoin(
      [
        this.settingsService.getFyleCredentials(workspaceId),
        this.settingsService.getNetSuiteCredentials(workspaceId),
        this.settingsService.getGeneralSettings(workspaceId),
      ]
    ).pipe(
      map(response => !!response),
      catchError(error => {
        const that = this;
        if (error.status === 400 && error.error.message === 'NetSuite Credentials not found in this workspace') {
          that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard');
        }
        const onboarded = that.storageService.get('onboarded');
        if (!onboarded) {
          that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard');
          return;
        }

        return that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`).then((res) => {
          that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard');
          return res;
        });
      })
    );
  }
}
