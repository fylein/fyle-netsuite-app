import { Injectable } from '@angular/core';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { Observable, from, Subject } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { AttributeCount } from '../models/attribute-count.model';
import { CategoryMappingsResponse } from '../models/category-mapping-response.model';
import { CategoryMapping } from '../models/category-mapping.model';
import { CustomSegment } from '../models/custom-segment.model';
import { EmployeeMappingsResponse } from '../models/employee-mapping-response.model';
import { EmployeeMapping } from '../models/employee-mapping.model';
import { ExpenseField } from '../models/expense-field.model';
import { Expense } from '../models/expense.model';
import { GeneralMapping } from '../models/general-mapping.model';
import { GroupedDestinationAttributes } from '../models/grouped-destination-attributes';
import { MappingDestination } from '../models/mapping-destination.model';
import { MappingSource } from '../models/mapping-source.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { Mapping } from '../models/mappings.model';
import { SubsidiaryMapping } from '../models/subsidiary-mapping.model';
import { WorkspaceService } from './workspace.service';

const generalMappingsCache = new Subject<void>();
const subsidiaryMappingCache$ = new Subject<void>();

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  destinationWorkspace: Observable<{}>;
  sourceWorkspace: Observable<{}>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  postNetsuiteCustomSegments(data: CustomSegment): Observable<CustomSegment> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/custom_segments/`, data);
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

  refreshNetSuiteDimensions(dimensionsToSync: string[] = []) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  }

  refreshDimension() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    this.apiService.post(`/workspaces/${workspaceId}/netsuite/refresh_dimensions/`, {}).subscribe();
    this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {}).subscribe();
  }

  getFyleFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/fyle_fields/`, {});
  }

  getNetSuiteFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/netsuite_fields/`, {});
  }

  getSkipExportConditionField(): Observable<ExpenseField[]>{
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/custom_fields/`, {});
  }

  getSkipExportValueField(attributeType: string, active: boolean = false): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {[key: string]: any} = {};

    if (attributeType==="employee_email"){  attributeType = "EMPLOYEE"  }
    params.attribute_type = attributeType.toUpperCase();

    if (active === true) {  params.active = true; }
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_attributes/`, params);
  }

  getFyleExpenseAttributes(attributeType: string, active: boolean = false): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {[key: string]: any} = {};

    params.attribute_type = attributeType.toUpperCase();

    if (active === true) {  params.active = true; }
    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_attributes/`, params);
  }

  getNetSuiteDestinationAttributes(attributeTypes: string | string[], active: boolean = false): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {[key: string]: any} = {};
    params.attribute_types = attributeTypes;

    if (active === true) {
      params.active = true;
    }

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/destination_attributes/`, params);
  }

  getNetsuiteAttributesCount(attributeType: string): Observable<AttributeCount> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/attributes/count/`, {
      attribute_type: attributeType
    });
  }

  getGroupedNetSuiteDestinationAttributes(attributeTypes: string[]): Observable<GroupedDestinationAttributes> {
    return from(this.getNetSuiteDestinationAttributes(attributeTypes).toPromise().then((response: MappingDestination[]) => {
      return response.reduce((groupedAttributes: GroupedDestinationAttributes, attribute: MappingDestination) => {
        const group: MappingDestination[] = groupedAttributes[attribute.attribute_type] || [];
        group.push(attribute);
        groupedAttributes[attribute.attribute_type] = group;

        return groupedAttributes;
      }, {
        VENDOR_PAYMENT_ACCOUNT: [],
        VENDOR: [],
        CLASS: [],
        ACCOUNTS_PAYABLE: [],
        EMPLOYEE: [],
        ACCOUNT: [],
        SUBSIDIARY: [],
        CURRENCY: [],
        DEPARTMENT: [],
        PROJECT: [],
        TAX_ITEM: [],
        LOCATION: [],
        EXPENSE_CATEGORY: [],
        BANK_ACCOUNT: [],
        CREDIT_CARD_ACCOUNT: [],
      });
    }));
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

  @Cacheable({
    cacheBusterObserver: subsidiaryMappingCache$
  })
  getSubsidiaryMappings(): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/subsidiaries/`, {}
    );
  }

  @CacheBuster({
    cacheBusterNotifier: subsidiaryMappingCache$
  })
  postSubsidiaryMappings(subsidiaryMappingPayload: SubsidiaryMapping): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/subsidiaries/`, subsidiaryMappingPayload);
  }

  @CacheBuster({
    cacheBusterNotifier: subsidiaryMappingCache$
  })
  postCountryDetails(): Observable<SubsidiaryMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/mappings/post_country/`, {});
  }

  getMappings(pageLimit: number, pageOffset: number, sourceType: string, tableDimension: number = 2, sourceActive: boolean = false): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    const params: {[key: string]: any} = {};
    params.source_type = sourceType;
    params.limit = pageLimit;
    params.offset = pageOffset;
    params.table_dimension = tableDimension;

    if (sourceActive === true) {
      params.source_active = true;
    }
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/`, params
    );
  }

  getEmployeeMappings(pageLimit: number, pageOffset: number): Observable<EmployeeMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employee/`, {
        limit: pageLimit,
        offset: pageOffset
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

  getCategoryMappings(pageLimit: number, pageOffset: number): Observable<CategoryMappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/category/`, {
        limit: pageLimit,
        offset: pageOffset,
        source_active: true
      }
    );
  }

  postCategoryMappings(mapping: CategoryMapping): Observable<Mapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/category/`, mapping);
  }

  triggerAutoMapEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }

  postEmployeeMappings(employeeMapping: EmployeeMapping): Observable<EmployeeMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/employee/`, employeeMapping);
  }
}
