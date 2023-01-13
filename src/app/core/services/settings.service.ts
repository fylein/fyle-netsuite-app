import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ngx-cacheable';
import { FyleCredentials } from '../models/fyle-credentials.model';
import { NetSuiteCredentials } from '../models/netsuite-credentials.model';
import { MappingSetting } from '../models/mapping-setting.model';
import { GeneralSetting } from '../models/general-setting.model';
import { MappingSettingResponse } from '../models/mapping-setting-response.model';
import { ScheduleSettings } from '../models/schedule-settings.model';
import { WorkspaceService } from './workspace.service';
import { SubsidiaryMapping } from '../models/subsidiary-mapping.model';
import { SkipExport } from '../models/skip-export.model';
import { SkipExportSelected } from '../models/skip-export-selected.model';

const fyleCredentialsCache = new Subject<void>();
const netsuiteCredentialsCache = new Subject<void>();
const generalSettingsCache = new Subject<void>();
const mappingsSettingsCache = new Subject<void>();
const skipExportCache = new Subject<void>();

const subsidiaryMappingCache$ = new Subject<void>();

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

  postSettings(intervalHours: number, scheduleEnabled: boolean, selectedEmail: string[], addedEmail: {}): Observable<ScheduleSettings> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/schedule/`, {
      hours: intervalHours,
      schedule_enabled: scheduleEnabled,
      added_email: addedEmail,
      selected_email: selectedEmail
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
    cacheBusterNotifier: generalSettingsCache
  })
  patchGeneralSettings(workspaceId: number, memoStructure: string[]): Observable<GeneralSetting> {
    return this.apiService.patch(`/workspaces/${workspaceId}/configuration/`, {
      memo_structure: memoStructure
    });
  }

  @CacheBuster({
    cacheBusterNotifier: generalSettingsCache
  })
  skipCardsMapping(workspaceId: number): Observable<GeneralSetting> {
    return this.apiService.patch(`/workspaces/${workspaceId}/configuration/`, {
      map_fyle_cards_netsuite_account: true,
      skip_cards_mapping: true
    });
  }

  @CacheBuster({
    cacheBusterNotifier: mappingsSettingsCache
  })
  postMappingSettings(workspaceId: number, mappingSettings: MappingSetting[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/settings/`, mappingSettings);
  }

  @CacheBuster({
    cacheBusterNotifier: skipExportCache
  })
  postSkipExport(workspaceId: number, skipExport: SkipExport): Observable<SkipExport> {
    workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_filters/`, skipExport);
  }
  getSkipExport(workspaceId: number): Observable<SkipExportSelected> {
    workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_filters/`, {});
  }
  @Cacheable({
    cacheBusterObserver: generalSettingsCache
  })
  getGeneralSettings(): Observable<GeneralSetting> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/configuration/`, {});
  }
}
