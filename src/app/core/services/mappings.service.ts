import { Injectable } from '@angular/core';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { Observable, from, Subject } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { AttributeCount } from '../models/attribute-count.model';
import { CustomSegment } from '../models/custom-segment.model';
import { ExpenseField } from '../models/expense-field.model';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingDestination } from '../models/mapping-destination.model';
import { MappingSource } from '../models/mapping-source.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { Mapping } from '../models/mappings.model';
import { SubsidiaryMapping } from '../models/subsidiary-mapping.model';
import { WorkspaceService } from './workspace.service';

const generalMappingsCache = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  destinationWorkspace: Observable<{}>;
  sourceWorkspace: Observable<{}>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  syncNetsuiteExpenseCustomFields(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/custom_fields/`, {});
  }

  postNetsuiteCustomSegments(data: CustomSegment): Observable<CustomSegment> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/custom_segments/`, data);
  }

  postNetSuiteSubsidiaries(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/subsidiaries/`, {});
  }

  syncNetSuiteDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.destinationWorkspace) {
      this.destinationWorkspace = this.apiService.post(`/workspaces/${workspaceId}/netsuite/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.destinationWorkspace;
  }

  syncFyleDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.sourceWorkspace) {
      this.sourceWorkspace = this.apiService.post(`/workspaces/${workspaceId}/fyle/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.sourceWorkspace;
  }

  refreshNetSuiteDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/refresh_dimensions/`, {});
  }

  refreshFyleDimensions() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {});
  }

  getFyleFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/fyle_fields/`, {});
  }

  getNetSuiteFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/netsuite_fields/`, {});
  }

  getFyleExpenseAttributes(attributeType: string): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_attributes/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseCustomFields(attributeType: string): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteAttributesCount(attributeType: string): Observable<AttributeCount> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/attributes/count/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseSegments(): Observable<CustomSegment[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_segments/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalMappingsCache
  })
  postGeneralMappings(generalMappings: GeneralMapping): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

  @Cacheable({
    cacheBusterObserver: generalMappingsCache
  })
  getGeneralMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }

  getSubsidiaryMappings(): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/subsidiaries/`, {}
    );
  }

  getMappings(pageLimit: number, pageOffset: number, sourceType: string, tableDimension: number = 2): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/`, {
        source_type: sourceType,
        limit: pageLimit,
        offset: pageOffset,
        table_dimension: tableDimension
      }
    );
  }

  getAllMappings(sourceType: string): Observable<MappingsResponse> {
    const limit = 500;
    const offset = 0;

    // tslint:disable-next-line: prefer-const
    let allMappingsResponse;

    return from(this.getAllMappingsInternal(limit, offset, sourceType, allMappingsResponse));
  }

  private getAllMappingsInternal(limit: number, offset: number, sourceType: string, allMappingsResponse: MappingsResponse): Promise<MappingsResponse> {
    const that = this;
    return that.getMappings(limit, offset, sourceType).toPromise().then((expenseGroupRes) => {
      if (!allMappingsResponse) {
        allMappingsResponse = expenseGroupRes;
      } else {
        allMappingsResponse.results = allMappingsResponse.results.concat(expenseGroupRes.results);
      }

      if (allMappingsResponse.results.length < allMappingsResponse.count) {
        return that.getAllMappingsInternal(limit, offset + limit, sourceType, allMappingsResponse);
      } else {
        return allMappingsResponse;
      }
    });
  }

  postMappings(mapping: Mapping): Observable<Mapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/`, mapping);
  }

  triggerAutoMapEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }
}
