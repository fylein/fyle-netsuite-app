import { Injectable } from '@angular/core';
import { Observable, Subject, merge, forkJoin, from } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';
import { FyleCredentials } from '../models/fyle-credentials.model';
import { NetSuiteCredentials } from '../models/netsuite-credentials.model';
import { MappingSetting } from '../models/mapping-setting.model';
import { GeneralSetting } from '../models/general-setting.model';
import { MappingSettingResponse } from '../models/mapping-setting-response.model';
import { ScheduleSettings } from '../models/schedule-settings.model';
import { SubsidiaryMapping } from '../models/subsidiary-mapping.model';
import { WorkspaceService } from './workspace.service';

const fyleCredentialsCache = new Subject<void>();
const netsuiteCredentialsCache = new Subject<void>();
const generalSettingsCache = new Subject<void>();
const mappingsSettingsCache = new Subject<void>();
const subsidiaryMappingCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private apiService: ApiService, private workspaceService: WorkspaceService) { }

  @Cacheable({
    cacheBusterObserver: fyleCredentialsCache
  })
  getFyleCredentials(): Observable<FyleCredentials> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/credentials/fyle/`, {});
  }

  @Cacheable({
    cacheBusterObserver: netsuiteCredentialsCache
  })
  getNetSuiteCredentials(): Observable<NetSuiteCredentials> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/credentials/netsuite/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: fyleCredentialsCache
  })
  connectFyle(workspaceId: number, authorizationCode: string): Observable<FyleCredentials> {
    return this.apiService.post(`/workspaces/${workspaceId}/connect_fyle/authorization_code/`, {
      code: authorizationCode
    });
  }

  @CacheBuster({
    cacheBusterNotifier: netsuiteCredentialsCache
  })
  connectNetSuite(netsuiteCredentials: NetSuiteCredentials): Observable<NetSuiteCredentials> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    globalCacheBusterNotifier.next();

    return this.apiService.post(`/workspaces/${workspaceId}/connect_netsuite/tba/`, netsuiteCredentials
    );
  }

  postSettings(intervalHours: number, scheduleEnabled: boolean): Observable<ScheduleSettings> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, {
      hours: intervalHours,
      schedule_enabled: scheduleEnabled
    });
  }

  getSettings(): Observable<ScheduleSettings> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/schedule/`, {});
  }

  @Cacheable({
    cacheBusterObserver: mappingsSettingsCache
  })
  getMappingSettings(): Observable<MappingSettingResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/mappings/settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  postGeneralSettings(workspaceId: number, generalSettings: GeneralSetting): Observable<GeneralSetting> {
    return this.apiService.post(`/workspaces/${workspaceId}/configuration/`, generalSettings);
  }

  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: MappingSetting[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(): Observable<GeneralSetting> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/configuration/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: subsidiaryMappingCache
  })
  postSubsidiaryMappings(subsidiaryMappingPayload: SubsidiaryMapping): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, subsidiaryMappingPayload);
  }

  @Cacheable({
    cacheBusterObserver: merge(generalSettingsCache, generalSettingsCache)
  })
  getCombinedSettings(): Observable<GeneralSetting> {
    // TODO: remove promises and do with rxjs observables
    return from(forkJoin(
      [
        this.getGeneralSettings(),
        this.getMappingSettings()
      ]
    ).toPromise().then(responses => {
      const generalSettings: GeneralSetting = responses[0];
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
