import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { ExpenseField } from 'src/app/core/models/expense-field.model';
import { SubsidiaryMapping } from 'src/app/core/models/subsidiary-mapping.model';

@Component({
  selector: 'app-netsuite-configurations',
  templateUrl: './netsuite-configurations.component.html',
  styleUrls: ['./netsuite-configurations.component.scss', '../../netsuite.component.scss']
})
export class NetsuiteConfigurationsComponent implements OnInit {

  state: string;
  workspaceId: number;
  isParentLoading: boolean = true;
  fyleFields: ExpenseField[];
  generalSettings: GeneralSetting;

  constructor(private route: ActivatedRoute, private router: Router, private mappingsService: MappingsService, private settingsService: SettingsService) { }

  changeState(state: string) {
    const that = this;
    that.state = state;
    that.router.navigate([`workspaces/${that.workspaceId}/settings/configurations/${that.state.toLowerCase()}`]);
  }

  showExpenseFields() {
    const that = this;

    if (that.fyleFields && that.fyleFields.length && that.generalSettings) {
      return true;
    }

    return false;
  }

  reset() {
    const that = this;

    that.mappingsService.getSubsidiaryMappings().subscribe(() => {
      that.state = that.route.snapshot.firstChild ? that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'GENERAL' : 'GENERAL';

      forkJoin(
        [
          that.mappingsService.getFyleFields(),
          that.settingsService.getGeneralSettings()
        ]
      ).subscribe(result => {
        that.fyleFields = result[0];
        that.generalSettings = result[1];
        that.changeState(that.state);
        that.isParentLoading = false;
      }, () => {
        that.changeState(that.state);
        that.isParentLoading = false;
      });
    }, () => {
      that.state = that.route.snapshot.firstChild ? that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'SUBSIDIARY' : 'SUBSIDIARY';
      that.changeState(that.state);
      that.isParentLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.reset();
  }
}
