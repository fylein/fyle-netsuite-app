import { Injectable } from '@angular/core';
import { Observable, Subject, merge, forkJoin, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';
import { FyleCredentials } from '../models/fyle-credentials.model';
import { NetSuiteCredentials } from '../models/netsuite-credentials.model';
import { Settings } from '../models/settings.model';

const fyleCredentialsCache = new Subject<void>();
const netsuiteCredentialsCache = new Subject<void>();
const generalSettingsCache = new Subject<void>();
const mappingsSettingsCache = new Subject<void>();
const subsidiaryMappingCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private apiService: ApiService) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(workspaceId: number): Observable<FyleCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/fyle/', {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  deleteFyleCredentials(workspaceId: number) {
    return this.apiService.post('/workspaces/' + workspaceId + '/credentials/fyle/delete/', {});
  }

  @Cacheable({
    cacheBusterObserver: netsuiteCredentialsCache
  })
  getNetSuiteCredentials(workspaceId: number): Observable<NetSuiteCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/netsuite/', {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string) {
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_fyle/authorization_code/', {
      code: authorizationCode
    });
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: netsuiteCredentialsCache
  })
  connectNetSuite(workspaceId: number, netsuiteCredentials) {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_netsuite/tba/', netsuiteCredentials
    );
  }

  postSettings(workspaceId: number, nextRun: string, intervalHours: number, scheduleEnabled: boolean) {
    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, {
      next_run: nextRun,
      hours: intervalHours,
      schedule_enabled: scheduleEnabled
    });
  }

  getSettings(workspaceId: number): Observable<Settings> {
    return this.apiService.get(`/workspaces/${workspaceId}/schedule/`, {});
  }

  // TODO: Add model
  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache
  })
  getMappingSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  postGeneralSettings(workspaceId: number, reimbursableExpensesObject: string, corporateCreditCardExpensesObject: string, fyleToNetSuite: boolean, netSuiteToFyle: boolean) {
    return this.apiService.post(`/workspaces/${workspaceId}/settings/general/`, {
      reimbursable_expenses_object: reimbursableExpensesObject,
      corporate_credit_card_expenses_object: corporateCreditCardExpensesObject,
      sync_fyle_to_netsuite_payments: fyleToNetSuite,
      sync_netsuite_to_fyle_payments: netSuiteToFyle
    });
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: any) {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  // TODO: Add model
  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(workspaceId: number) {
    return this.apiService.get(`/workspaces/${workspaceId}/settings/general/`, {});
  }

  // TODO: Add model
  @CacheBuster({
    cacheBusterNotifier: subsidiaryMappingCache
  })
  postSubsidiaryMappings(workspaceId: number, internalId: string, subsidiaryName: string) {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, {
      subsidiary_name: subsidiaryName,
      internal_id: internalId
    });
  }

  // TODO: Add model
  @Cacheable({
    cacheBusterObserver: merge(generalSettingsCache, generalSettingsCache)
  })
  getCombinedSettings(workspaceId: number) {
    // TODO: remove promises and do with rxjs observables
    return from(forkJoin(
      [
        this.getGeneralSettings(workspaceId),
        this.getMappingSettings(workspaceId)
      ]
    ).toPromise().then(responses => {
      const generalSettings = responses[0];
      const mappingSettings = responses[1].results;

      const employeeFieldMapping = mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
        (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      const projectFieldMapping = mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      generalSettings.employee_field_mapping = employeeFieldMapping.destination_field;

      if (projectFieldMapping) {
        generalSettings.project_field_mapping = projectFieldMapping.destination_field;
      }

      if (costCenterFieldMapping) {
        generalSettings.cost_center_field_mapping = costCenterFieldMapping.destination_field;
      }

      return generalSettings;
    }));
  }
}
