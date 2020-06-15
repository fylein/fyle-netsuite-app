import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MappingsService } from './mappings.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css', '../base.component.css'],
})
export class MappingsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private mappingService: MappingsService) {}

  generalSettings: any;
  projectFieldMapping: any;
  costCenterFieldMapping: any;
  projectsEnabled: boolean = false;
  costCentersEnabled: boolean = false;
  isLoading = true;

  updateDimensionTables(workspaceId: number) {
    concat(
        this.mappingService.postNetSuiteSubsidiaries(workspaceId),
        this.mappingService.postExpenseAccounts(workspaceId),
        this.mappingService.postNetSuiteVendors(workspaceId),
        this.mappingService.postNetSuiteLocations(workspaceId),
        this.mappingService.postNetSuiteDepartments(workspaceId),
        this.mappingService.postFyleEmployees(workspaceId),
        this.mappingService.postFyleCategories(workspaceId),
        this.mappingService.postFyleCostCenters(workspaceId),
        this.mappingService.postFyleProjects(workspaceId)
    ).subscribe(response => {
      if (response) {
        this.isLoading = false;
      }
    },
    error => error);
  }

  ngOnInit() {
    this.projectFieldMapping = JSON.parse(localStorage.getItem('project_field_mapping'));
    this.costCenterFieldMapping = JSON.parse(localStorage.getItem('cost_center_field_mapping'));
    let workspace_id = JSON.parse(localStorage.getItem('workspace_id'));

    if (this.projectFieldMapping) {
      this.projectsEnabled = true;
    }

    this.updateDimensionTables(workspace_id);

    if (this.costCenterFieldMapping) {
      this.costCentersEnabled = true;
    }
  }
}
