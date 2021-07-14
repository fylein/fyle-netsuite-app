import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { environment } from 'src/environments/environment';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { Workspace } from 'src/app/core/models/workspace.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Count } from 'src/app/core/models/count.model';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const APP_URL = environment.app_url;

enum onboardingStates {
  initialized,
  fyleConnected,
  netsuiteConnected,
  subsidiaryMappingDone,
  configurationsDone,
  generalMappingsDone,
  employeeMappingsDone,
  categoryMappingsDone,
  isOnboarded
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../netsuite.component.scss']
})
export class DashboardComponent implements OnInit {
  workspaceId: number;
  isLoading = false;
  generalSettings: GeneralSetting;

  currentState = onboardingStates.initialized;

  get allOnboardingStates() {
    return onboardingStates;
  }

  rippleDisabled = true;
  linearMode = true;

  successfulExpenseGroupsCount = 0;
  failedExpenseGroupsCount = 0;
  windowReference: Window;

  constructor(
    private expenseGroupService: ExpenseGroupsService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService,
    private snackBar: MatSnackBar) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  connectFyle() {
    this.windowReference.location.href = `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  // TODO: remove promises and do with rxjs observables
  checkFyleLoginStatus() {
    const that = this;
    return that.settingsService.getFyleCredentials().toPromise().then(credentials => {
      that.currentState = onboardingStates.fyleConnected;
      return credentials;
    });
  }

  // TODO: remove promises and do with rxjs observables
  getNetSuiteStatus() {
    const that = this;
    return that.settingsService.getNetSuiteCredentials().toPromise().then(credentials => {
      that.currentState = onboardingStates.netsuiteConnected;
      return credentials;
    });
  }

  getSubsidiaryMappings() {
    const that = this;
    return that.mappingsService.getSubsidiaryMappings().toPromise().then(subsidiaryMappings => {
      that.currentState = onboardingStates.subsidiaryMappingDone;
      return subsidiaryMappings;
    });
  }

  getConfigurations() {
    const that = this;
    return forkJoin(
      [
        that.settingsService.getGeneralSettings(),
        that.settingsService.getMappingSettings()
      ]
    ).subscribe((res) => {
      that.generalSettings = res[0];
      that.currentState = onboardingStates.configurationsDone;
      return res;
    });
  }

  getGeneralMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.mappingsService.getGeneralMappings().toPromise().then(generalMappings => {
      that.currentState = onboardingStates.generalMappingsDone;
      return generalMappings;
    });
  }

  getEmployeeMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    if (that.generalSettings && that.generalSettings.auto_create_destination_entity) {
      that.currentState = onboardingStates.employeeMappingsDone;
      return;
    } else {
      return that.mappingsService.getMappings(1, 0, 'EMPLOYEE').toPromise().then((res) => {
        if (res.results.length > 0) {
          that.currentState = onboardingStates.employeeMappingsDone;
        } else {
          throw new Error('employee mappings have no entries');
        }
        return res;
      });
    }
  }

  getCategoryMappings() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.mappingsService.getMappings(1, 0, 'CATEGORY').toPromise().then((res) => {
      if (res.results.length > 0) {
        that.currentState = onboardingStates.categoryMappingsDone;
      } else {
        throw new Error('cateogry mappings have no entries');
      }
      return res;
    });
  }

  loadSuccessfullExpenseGroupsCount() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupService.getExpenseGroupCountByState('COMPLETE').toPromise().then((res: Count) => {
      that.successfulExpenseGroupsCount = res.count;
      return res;
    });
  }

  loadFailedlExpenseGroupsCount() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    return that.expenseGroupService.getExpenseGroupCountByState('FAILED').toPromise().then((res: Count) => {
      that.failedExpenseGroupsCount = res.count;
      return res;
    });
  }

  loadDashboardData() {
    const that = this;
    that.isLoading = true;
    // TODO: remove promises and do with rxjs observables
    return forkJoin([
      that.loadSuccessfullExpenseGroupsCount(),
      that.loadFailedlExpenseGroupsCount()
    ]).toPromise().then(() => {
      that.isLoading = false;
      return true;
    });
  }

  syncDimension() {
    const that = this;

    that.mappingsService.refreshFyleDimensions().subscribe(() => {});
    that.mappingsService.refreshNetSuiteDimensions().subscribe(() => {});

    that.snackBar.open('Refreshing Fyle and NetSuite Data');
  }

  // to be called in background whenever dashboard is opened for syncing fyle and netsuite data for current workspace
  updateDimensionTables() {
    const that = this;

    that.mappingsService.syncFyleDimensions().subscribe(() => {});
    that.mappingsService.syncNetSuiteDimensions().subscribe(() => {});
  }

  openSchedule(event) {
    const that = this;
    event.preventDefault();
    this.windowReference.open(`workspaces/${that.workspaceId}/settings/schedule`, '_blank');
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    const onboarded = that.storageService.get('onboarded');

    if (onboarded === true) {
      that.currentState = onboardingStates.isOnboarded;
      that.updateDimensionTables();
      that.loadDashboardData();
    } else {
      that.isLoading = true;
      that.checkFyleLoginStatus()
        .then(() => {
          return that.getNetSuiteStatus();
        }).then(() => {
          return that.getSubsidiaryMappings();
        }).then(() => {
          that.updateDimensionTables();
          return that.getConfigurations();
        }).then(() => {
          return that.getGeneralMappings();
        }).then(() => {
          return that.getEmployeeMappings();
        }).then(() => {
          return that.getCategoryMappings();
        }).then(() => {
          that.currentState = onboardingStates.isOnboarded;
          that.storageService.set('onboarded', true);
          return that.loadDashboardData();
        }).catch(() => {
          // do nothing as this just means some steps are left
          that.storageService.set('onboarded', false);
        }).finally(() => {
          that.isLoading = false;
        });
    }

  }

}
