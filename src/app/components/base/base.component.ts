import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkspaceService } from './workspace.service';
import { SettingsService } from './settings/settings.service'

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));;
  workspace: any = {};
  isLoading: boolean = true;
  fyleConnected: boolean = false;
  generalSettings: any;
  mappingSettings: any;

  constructor(private workspaceService: WorkspaceService, private settingsService: SettingsService, private router: Router) {
  }

  getGeneralSettings() { 
    this.settingsService.getMappingSettings(this.workspace.id).subscribe(response => {
      this.generalSettings = [
        {'project_field_mapping': ''},
        {'cost_center_field_mapping': ''},
        {'workspace_id': this.workspace.id}
      ]
      this.mappingSettings = response['results'];

      let projectFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      let costCenterFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      if (projectFieldMapping) {
        this.generalSettings['project_field_mapping'] = projectFieldMapping.destination_field;
        localStorage.setItem('project_field_mapping', JSON.stringify(projectFieldMapping.destination_field));
      }

      if (costCenterFieldMapping) {
        this.generalSettings['cost_center_field_mapping'] = costCenterFieldMapping.destination_field;
        localStorage.setItem('cost_center_field_mapping', JSON.stringify(costCenterFieldMapping.destination_field));
      }

    });
  }

  ngOnInit() {
    this.workspaceService.getWorkspaces().subscribe(workspaces => {
      let pathName = window.location.pathname;
      if (Array.isArray(workspaces) && workspaces.length) {
        this.workspace = workspaces[0];
        this.isLoading = false;
        if (pathName === '/workspaces') {
          this.router.navigateByUrl(`/workspaces/${this.workspace.id}/expense_groups`);
        }
        this.getGeneralSettings();
      } else {
        this.workspaceService.createWorkspace().subscribe(workspace => {
          this.workspace = workspace;
          this.isLoading = false;
          if (pathName === '/workspaces') {
            this.router.navigateByUrl(`/workspaces/${this.workspace.id}/settings`);
          }
        });
      }
    });
  }
}
