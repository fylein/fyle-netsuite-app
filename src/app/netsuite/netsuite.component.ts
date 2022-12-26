import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { SettingsService } from '../core/services/settings.service';
import { StorageService } from '../core/services/storage.service';
import { WindowReferenceService } from '../core/services/window.service';
import { Workspace } from '../core/models/workspace.model';
import { MappingSetting } from '../core/models/mapping-setting.model';
import { MappingSettingResponse } from '../core/models/mapping-setting-response.model';
import { MappingsService } from '../core/services/mappings.service';
import { MatSnackBar } from '@angular/material';
import { TrackingService } from '../core/services/tracking.service';

@Component({
  selector: 'app-netsuite',
  templateUrl: './netsuite.component.html',
  styleUrls: ['./netsuite.component.scss']
})
export class NetSuiteComponent implements OnInit {
  user: {
    employee_email: string,
    full_name: string,
    org_id: string,
    org_name: string
  };
  orgsCount: number;
  workspace: Workspace;
  isLoading = true;
  fyleConnected = false;
  netsuiteConnected = false;
  mappingSettings: MappingSetting[];
  showSwitchOrg = false;
  navDisabled = true;
  showRefreshIcon: boolean;
  windowReference: Window;

  constructor(
    private workspaceService: WorkspaceService,
    private settingsService: SettingsService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private mappingsService: MappingsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
    private trackingService: TrackingService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
  }

  refreshDashboardMappingSettings(mappingSettings: MappingSetting[]) {
    const that = this;

    that.mappingSettings = mappingSettings.filter(
      setting => (setting.source_field !== 'EMPLOYEE' && setting.source_field !== 'CATEGORY')
    );
    that.isLoading = false;
  }

  getGeneralSettings() {
    const that = this;
    that.getMappingSettings().then((mappingSettings: MappingSetting[]) => {
      that.refreshDashboardMappingSettings(mappingSettings);
    });
  }

  getMappingSettings() {
    const that = this;

    return that.settingsService.getMappingSettings().toPromise().then((mappingSetting: MappingSettingResponse) => {
      return mappingSetting.results;
    }, () => {
      that.isLoading = false;
    });
  }

  switchWorkspace() {
    this.authService.switchWorkspace();
    this.trackingService.onSwitchWorkspace();
  }

  getSettingsAndNavigate() {
    const that = this;
    const pathName = that.windowReference.location.pathname;
    that.storageService.set('workspaceId', that.workspace.id);
    if (pathName === '/workspaces') {
      that.router.navigateByUrl(`/workspaces/${that.workspace.id}/dashboard`);
    }
    that.getGeneralSettings();
    that.setupAccessiblePathWatchers();
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getConfigurations() {
    const that = this;

    return forkJoin(
      [
        that.settingsService.getGeneralSettings(),
        that.settingsService.getMappingSettings()
      ]
    ).toPromise();
  }

  setupAccessiblePathWatchers() {
    const that = this;
    that.getConfigurations().then(() => {
      that.navDisabled = false;
    }).catch(() => {
      // do nothing
    });

    that.router.events.subscribe(() => {
      const onboarded = that.storageService.get('onboarded');
      if (onboarded !== true) {
        that.getConfigurations().then(() => {
          that.navDisabled = false;
        }).catch(() => {
          // do nothing
        });
      }
    });
  }

  setupWorkspace() {
    const that = this;
    that.user = that.authService.getUser();
    that.workspaceService.getWorkspaces(that.user.org_id).subscribe(workspaces => {
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        that.workspace = workspaces[0];
        that.setUserIdentity(that.user.employee_email, that.workspace.id, {fullName: that.user.full_name});
        that.getSettingsAndNavigate();
      } else {
        that.workspaceService.createWorkspace().subscribe(workspace => {
          that.workspace = workspace;
          that.setUserIdentity(that.user.employee_email, that.workspace.id, {fullName: that.user.full_name});
          that.getSettingsAndNavigate();
        });
      }
    });
  }

  setUserIdentity(email: string, workspaceId: number, properties) {
    this.trackingService.onSignIn(email, workspaceId, properties);
  }

  onSignOut() {
    this.trackingService.onSignOut();
  }

  onConnectNetSuitePageVisit() {
    this.trackingService.onPageVisit('Connect NetSuite');
  }

  onSelectSubsidiaryPageVisit() {
    this.trackingService.onPageVisit('Select Subsidiary');
  }

  onConfigurationsPageVisit() {
    this.trackingService.onPageVisit('Configurations');
  }

  onGeneralMappingsPageVisit() {
    this.trackingService.onPageVisit('Genral Mappings');
  }

  onEmployeeMappingsPageVisit() {
    this.trackingService.onPageVisit('Employee Mappings');
  }

  onCategoryMappingsPageVisit() {
    this.trackingService.onPageVisit('Category Mappings');
  }

  getNetSuiteStatus() {
    const that = this;
    const workspaceId = this.storageService.get('workspaceId');
    if (workspaceId) {
      that.settingsService.getNetSuiteCredentials().subscribe(credentials => {
        if (credentials) {
          that.netsuiteConnected = true;
        }
      });
    }
  }

  hideRefreshIconVisibility() {
    this.showRefreshIcon = false;
  }

  syncDimension() {
    const that = this;
    that.mappingsService.refreshDimension();
    that.snackBar.open('Refreshing Fyle and NetSuite Data');
  }

  ngOnInit() {
    const that = this;
    const onboarded = that.storageService.get('onboarded');
    that.showRefreshIcon = !onboarded;
    that.navDisabled = onboarded !== true;
    that.orgsCount = that.authService.getOrgCount();
    that.setupWorkspace();
    that.getNetSuiteStatus();
  }
}
