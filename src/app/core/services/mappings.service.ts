import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';
import { GeneralMapping } from '../models/general-mapping.model';
import { MappingsResponse } from '../models/mappings-response.model';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root',
})
export class MappingsService {
  // TODO: Map models to each of these and the methods below

  fyleCategories: Observable<any[]>;
  netsuiteAccounts: Observable<any[]>;
  fyleEmployees: Observable<any[]>;
  netsuiteVendors: Observable<any[]>;
  netsuiteEmployees: Observable<any[]>;
  fyleProjects: Observable<any[]>;
  netsuiteDepartments: Observable<any[]>;
  fyleCostCenters: Observable<any[]>;
  netsuiteLocations: Observable<any[]>;
  netsuiteClasses: Observable<any[]>;
  generalMappings: Observable<any[]>;
  accountPayables: Observable<any[]>;
  netsuiteSubsidiaries: Observable<any[]>;

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

  getFyleCategories() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/fyle/categories/`, {});
  }

  getNetSuiteVendors() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(`/workspaces/${workspaceId}/netsuite/vendors/`, {});
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

  getBankAccounts() {
    const workspaceId = this.workspaceService.getWorkspaceId();

    return this.apiService.get(
      `/workspaces/${workspaceId}/netsuite/bank_accounts/`, {}
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

  // TODO: Replace any with proper model
  postGeneralMappings(workspace_id: number, location_name: string, location_id: string, accounts_payable_name: string, accounts_payable_id: string, reimbursable_account_name: string, reimbursable_account_id: string, default_ccc_account_name: string, default_ccc_account_id: string): Observable<any> {
    this.netsuiteAccounts = null;
    const workspaceId = this.workspaceService.getWorkspaceId();
    const generalMappings = {
      location_name: location_name,
      location_id: location_id,
      accounts_payable_name: accounts_payable_name,
      accounts_payable_id: accounts_payable_id,
      reimbursable_account_name: reimbursable_account_name,
      reimbursable_account_id: reimbursable_account_id,
      default_ccc_account_name: default_ccc_account_name,
      default_ccc_account_id: default_ccc_account_id
    };
    return this.apiService.post(`/workspaces/${workspaceId}/mappings/general/`, generalMappings);
  }

  getGeneralMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/general/`, {}
    );
  }


  getSubsidiaryMappings(): Observable<GeneralMapping> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/subsidiaries/`, {}
    );
  }

  getMappings(sourceType): Observable<MappingsResponse> {
    const workspaceId = this.workspaceService.getWorkspaceId();
    return this.apiService.get(
      `/workspaces/${workspaceId}/mappings/`, {
        source_type: sourceType
      }
    );
  }

  postMappings(mapping: any) {
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
