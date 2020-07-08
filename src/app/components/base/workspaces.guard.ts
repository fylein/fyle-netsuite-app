import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { SettingsService } from 'src/app/components/base/settings/settings.service';
import { MappingsService } from 'src/app/components/base/mappings/mappings.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {


  constructor(private settingsService: SettingsService, private mappingsService: MappingsService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let params = next.params;
    let workspaceId = +params['workspace_id']

    this.settingsService.getMappingSettings(workspaceId).subscribe(mappings => {
      let state: string
      if(mappings['count'] < 2) {
        state = 'settings'
        let error = 'General Setting not found'
        return this.router.navigateByUrl(`workspaces/${workspaceId}/settings?state=${state}&error=${error}`);
      }
    });

    return forkJoin(
      [
        this.settingsService.getFyleCredentials(workspaceId),
        this.settingsService.getNetSuiteCredentials(workspaceId),
        this.settingsService.getSubsidiaryMappings(workspaceId)
      ]
    ).pipe(
      map(response => response? true: false),
      catchError(error => {
        let state: string
        if (error.status == 400) {
          if(error.error.message === 'NetSuite Credentials not found in this workspace') {
            state = 'destination';
          } else if(error.error.message === 'Subsidiary mappings do not exist for the workspace') {
            state = 'subsidiary';
          } else {
            state = 'source';
          }
        }
        return this.router.navigateByUrl(`workspaces/${workspaceId}/settings?state=${state}&error=${error.error.message}`);
      })
    );
  }
}
