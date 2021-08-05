import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { ExpenseField } from 'src/app/core/models/expense-field.model';

@Component({
  selector: 'app-netsuite-configurations',
  templateUrl: './netsuite-configurations.component.html',
  styleUrls: ['./netsuite-configurations.component.scss', '../../netsuite.component.scss']
})
export class NetsuiteConfigurationsComponent implements OnInit {

  state: string;
  workspaceId: number;
  isParentLoading: boolean;
  fyleFields: ExpenseField[];
  generalSettings: GeneralSetting;
  netsuiteConnection: boolean;
  netsuiteConnectionDone: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private mappingsService: MappingsService, private settingsService: SettingsService) { }

  changeState(state) {
    const that = this;
    if (that.state === 'GENERAL') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
    if (that.state === 'SUBSIDIARY') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
    if (that.state === 'EXPENSE_FIELDS') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
    if (that.state === 'CUSTOM_SEGMENTS') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
    }
  }

  showExpenseFields() {
    const that = this;

    if (that.fyleFields && that.fyleFields.length && that.generalSettings) {
      return true;
    }

    return false;
  }

  ngOnInit() {
    const that = this;

    that.isParentLoading = true;

    that.netsuiteConnection = false;

    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'SUBSIDIARY';

    that.settingsService.getNetSuiteCredentials().subscribe(response => {
      if (response) {
        that.netsuiteConnectionDone = true;
      }
      forkJoin(
        [
          that.mappingsService.getFyleFields(),
          that.settingsService.getGeneralSettings()
        ]
      ).subscribe(result => {
        that.fyleFields = result[0];
        that.generalSettings = result[1];
        that.isParentLoading = false;
      }, () => {
        that.isParentLoading = false;
      });

    });
  }
}
