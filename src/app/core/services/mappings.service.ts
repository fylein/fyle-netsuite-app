import { Injectable } from '@angular/core';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { Observable, from, Subject } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
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
  netsuiteSubsidiaries: Observable<MappingDestination[]>;
  netsuiteAccounts: Observable<MappingDestination[]>;
  netsuiteVendors: Observable<MappingDestination[]>;
  netsuiteEmployees: Observable<MappingDestination[]>;
  netsuiteExpenseCustomFields: Observable<MappingDestination[]>;
  netsuiteProjectFields: Observable<MappingDestination[]>;
  netsuiteCustomerFields: Observable<MappingDestination[]>;
  netsuiteDepartments: Observable<MappingDestination[]>;
  netsuiteLocations: Observable<MappingDestination[]>;
  netsuiteClasses: Observable<MappingDestination[]>;
  netsuiteCategories: Observable<MappingDestination[]>;
  netsuiteCurrencies: Observable<MappingDestination[]>;
  destinationWorkspace: Observable<{}>;
  fyleCategories: Observable<MappingSource[]>;
  fyleEmployees: Observable<MappingSource[]>;
  fyleProjects: Observable<MappingSource[]>;
  fyleExpenseCustomFields: Observable<MappingSource[]>;
  fyleCostCenters: Observable<MappingSource[]>;
  sourceWorkspace: Observable<{}>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  postFyleEmployees(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleEmployees) {
      this.fyleEmployees = this.apiService.post(`/workspaces/${workspaceId}/fyle/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleEmployees;
  }

  postFyleCategories(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleCategories) {
      this.fyleCategories = this.apiService.post(`/workspaces/${workspaceId}/fyle/categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCategories;
  }

  postFyleProjects(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleProjects) {
      this.fyleProjects = this.apiService.post(`/workspaces/${workspaceId}/fyle/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleProjects;
  }

  postFyleCostCenters(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleCostCenters) {
      this.fyleCostCenters = this.apiService.post(`/workspaces/${workspaceId}/fyle/cost_centers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleCostCenters;
  }

  postExpenseCustomFields(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.fyleExpenseCustomFields) {
      this.fyleExpenseCustomFields = this.apiService.post(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.fyleExpenseCustomFields;
  }

  postNetsuiteExpenseCustomFields(sync: boolean = false): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteExpenseCustomFields || sync) {
      this.netsuiteExpenseCustomFields = this.apiService.post(`/workspaces/${workspaceId}/netsuite/custom_fields/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteExpenseCustomFields;
  }

  postNetsuiteProjectFields(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteProjectFields) {
      this.netsuiteProjectFields = this.apiService.post(`/workspaces/${workspaceId}/netsuite/projects/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteProjectFields;
  }

  postNetsuiteCustomerFields(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteCustomerFields) {
      this.netsuiteCustomerFields = this.apiService.post(`/workspaces/${workspaceId}/netsuite/customers/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteCustomerFields;
  }

  postNetsuiteCustomSegments(data: CustomSegment): Observable<CustomSegment> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/netsuite/custom_segments/`, data);
  }

  postNetSuiteVendors(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteVendors) {
      this.netsuiteVendors = this.apiService.post(`/workspaces/${workspaceId}/netsuite/vendors/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteVendors;
  }

  postNetSuiteCurrencies(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteCurrencies) {
      this.netsuiteCurrencies = this.apiService.post(`/workspaces/${workspaceId}/netsuite/currencies/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteCurrencies;
  }

  postNetSuiteExpenseCategories(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteCategories) {
      this.netsuiteCategories = this.apiService.post(`/workspaces/${workspaceId}/netsuite/expense_categories/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteCategories;
  }

  postNetSuiteEmployees(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteEmployees) {
      this.netsuiteEmployees = this.apiService.post(`/workspaces/${workspaceId}/netsuite/employees/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteEmployees;
  }

  postNetSuiteAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteAccounts) {
      this.netsuiteAccounts = this.apiService.post(
        `/workspaces/${workspaceId}/netsuite/accounts/`, {}
      ).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteAccounts;
  }

  postNetSuiteClasses(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteClasses) {
      this.netsuiteClasses = this.apiService.post(`/workspaces/${workspaceId}/netsuite/classifications/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteClasses;
  }

  postNetSuiteDepartments(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteDepartments) {
      this.netsuiteDepartments = this.apiService.post(`/workspaces/${workspaceId}/netsuite/departments/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteDepartments;
  }

  postNetSuiteLocations(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteLocations) {
      this.netsuiteLocations = this.apiService.post(`/workspaces/${workspaceId}/netsuite/locations/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteLocations;
  }


  postNetSuiteSubsidiaries(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    if (!this.netsuiteSubsidiaries) {
      this.netsuiteSubsidiaries = this.apiService.post(`/workspaces/${workspaceId}/netsuite/subsidiaries/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
    }
    return this.netsuiteSubsidiaries;
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

  getFyleEmployees(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleExpenseFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleCategories(): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getNetSuiteVendors(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/vendors/`, {});
  }

  getNetSuiteFields(): Observable<ExpenseField[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/netsuite_fields/`, {});
  }

  getFyleExpenseCustomFields(attributeType: string): Observable<MappingSource[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseCustomFields(attributeType: string): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseSegments(): Observable<CustomSegment[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_segments/`, {});
  }

  getNetSuiteEmployees(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/employees/`, {});
  }

  getNetSuiteLocations(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/locations/`, {});
  }

  getNetSuiteClasses(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/classifications/`, {});
  }

  getNetSuiteDepartments(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/departments/`, {});
  }

  getExpenseAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/accounts/`, {}
    );
  }

  getCCCExpenseAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/ccc_accounts/`, {}
    );
  }

  getExpenseCategories(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/expense_categories/`, {}
    );
  }

  getCCCExpenseCategories(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/ccc_expense_categories/`, {}
    );
  }

  getBankAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/bank_accounts/`, {}
    );
  }

  getVendorPaymentAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/vendor_payment_accounts/`, {}
    );
  }

  getAccountsPayables(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/credit_card_accounts/`, {}
    );
  }

  getNetSuiteSubsidiaries(): Observable<MappingDestination[]> {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/subsidiaries/`, {});
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
