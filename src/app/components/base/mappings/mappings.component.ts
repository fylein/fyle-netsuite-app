import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MappingsService } from './mappings.service';
import { concat, forkJoin } from 'rxjs';

@Component({
  selector: 'app-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.css', '../base.component.css'],
})
export class MappingsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private mappingService: MappingsService) {}
  
  workspaceId: number;
  generalSettings: any;
  projectFieldMapping: any;
  costCenterFieldMapping: any;
  projectsEnabled: boolean = false;
  costCentersEnabled: boolean = false;
  isLoading = true;

  updateDimensionTables(workspaceId: number) {
    concat(
        this.mappingService.postNetSuiteAccounts(workspaceId),
        this.mappingService.postNetSuiteVendors(workspaceId),
        this.mappingService.postNetSuiteEmployees(workspaceId),
        this.mappingService.postFyleEmployees(workspaceId),
        this.mappingService.postFyleCategories(workspaceId),
        this.mappingService.postNetSuiteDepartments(workspaceId),
        this.mappingService.postFyleProjects(workspaceId),
        this.mappingService.postNetSuiteClasses(workspaceId),
        this.mappingService.postFyleCostCenters(workspaceId)
    ).subscribe(response => {
      if (response) {
        this.isLoading = false;
      }
    },
    error => error);
  }

  ngOnInit() {
    this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));

    this.updateDimensionTables(this.generalSettings.workspace);
    
    if (this.generalSettings.project_field_mapping) {
      this.projectsEnabled = true;
    }

    if (this.generalSettings.cost_center_field_mapping) {
      this.costCentersEnabled = true;
    }
  }
}
