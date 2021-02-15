import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { CustomSegment } from '../models/custom-segment.model';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingDestination } from '../models/mapping-destination.model';
import { MappingSource } from '../models/mapping-source.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { Mapping } from '../models/mappings.model';
import { SubsidiaryMapping } from '../models/subsidiary-mapping.model';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  // TODO: Map models to each of these and the methods below

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
  fyleCategories: Observable<MappingSource[]>;
  fyleEmployees: Observable<MappingSource[]>;
  fyleProjects: Observable<MappingSource[]>;
  fyleExpenseCustomFields: Observable<MappingSource[]>;
  fyleCostCenters: Observable<MappingSource[]>;

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  postFyleEmployees() {
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

  postFyleCategories() {
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

  postFyleProjects() {
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

  postFyleCostCenters() {
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

  postExpenseCustomFields() {
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

  postNetsuiteExpenseCustomFields(sync: boolean = false) {
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

  postNetsuiteProjectFields() {
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

  postNetsuiteCustomerFields() {
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

  postNetSuiteVendors() {
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

  postNetSuiteCurrencies() {
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

  postNetSuiteExpenseCategories() {
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

  postNetSuiteEmployees() {
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

  postNetSuiteAccounts() {
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

  postNetSuiteClasses() {
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

  postNetSuiteDepartments() {
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

  postNetSuiteLocations() {
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


  postNetSuiteSubsidiaries() {
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


  getFyleEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/employees/`, {});
  }

  getFyleExpenseFields() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getNetSuiteVendors() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/vendors/`, {});
  }

  getNetSuiteFields() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/netsuite_fields/`, {});
  }

  getFyleExpenseCustomFields(attributeType: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/expense_custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseCustomFields(attributeType: string) {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getNetsuiteExpenseSegments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/custom_segments/`, {});
  }

  getNetSuiteEmployees() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/employees/`, {});
  }

  getNetSuiteLocations() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/locations/`, {});
  }

  getFyleProjects() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/projects/`, {});
  }

  getNetSuiteClasses() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/classifications/`, {});
  }

  getNetSuiteDepartments() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/departments/`, {});
  }

  getFyleCostCenters() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/cost_centers/`, {});
  }

  getExpenseAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/accounts/`, {}
    );
  }

  getExpenseCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/expense_categories/`, {}
    );
  }

  getCCCExpenseCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/ccc_expense_categories/`, {}
    );
  }

  getBankAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/bank_accounts/`, {}
    );
  }

  getVendorPaymentAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/vendor_payment_accounts/`, {}
    );
  }

  getAccountsPayables() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/accounts_payables/`, {}
    );
  }

  getCreditCardAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/credit_card_accounts/`, {}
    );
  }

  getNetSuiteSubsidiaries() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/subsidiaries/`, {});
  }

  postGeneralMappings(generalMappings: GeneralMapping) {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

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

  getMappings(pageLimit: number, pageOffset: number, sourceType: string): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/`, {
        source_type: sourceType,
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

  getCategoryMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/categories/`, {}
    );
  }

  getEmployeeMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/employees/`, {}
    );
  }

  getProjectMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/projects/`, {}
    );
  }

  getCostCenterMappings() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/cost_centers/`, {}
    );
  }
}
