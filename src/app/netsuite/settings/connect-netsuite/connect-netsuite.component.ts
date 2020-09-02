import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-connect-netsuite',
  templateUrl: './connect-netsuite.component.html',
  styleUrls: ['./connect-netsuite.component.scss', '../../netsuite.component.scss']
})
export class ConnectNetsuiteComponent implements OnInit {
  state: string;
  workspaceId: number;
  isParentLoading: boolean;
  fyleFields: any;
  netsuiteConnection: any;
  netsuiteConnectionDone: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private mappingsService: MappingsService, private settingsService: SettingsService) { }

  changeState(state) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/netsuite/${that.state.toLowerCase()}`]);
    }
    if (that.state == 'SUBSIDIARY') {
      that.state = state;
      that.router.navigate([`workspaces/${that.workspaceId}/settings/netsuite/${that.state.toLowerCase()}`]);
    }
  }

  ngOnInit() {
    const that = this;

    that.isParentLoading = true;
    that.netsuiteConnection = false;

    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'GENERAL';
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;

    forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getNetSuiteCredentials(that.workspaceId)
      ]
    ).subscribe(response => {
      that.fyleFields = response[0];
      that.netsuiteConnection = response[1]
      if(that.netsuiteConnection){
          that.netsuiteConnectionDone = true;
      }
      that.isParentLoading = false;
    }, () => {
      that.isParentLoading = false;
    });
  }

}
