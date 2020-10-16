import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/core/services/storage.service';
import { GenericMappingsDialogComponent } from './generic-mappings-dialog/generic-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { EditGenericMappingsDialogComponent } from './edit-generic-mappings-dialog/edit-generic-mappings-dialog.component'

@Component({
  selector: 'app-generic-mappings',
  templateUrl: './generic-mappings.component.html',
  styleUrls: ['./generic-mappings.component.scss', '../settings.component.scss', '../../netsuite.component.scss']
})
export class GenericMappingsComponent implements OnInit {
  workspaceId: number;
  source_field: string;
  isLoading: boolean;
  mappings: any[];
  generalSettings: any;
  setting: any;
  fyleValue: any;
  columnsToDisplay = ['sourceField', 'destinationField'];

  constructor(private mappingsService: MappingsService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private storageService: StorageService, private settingsService: SettingsService) { }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(GenericMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        setting: that.setting
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.getMappings();
    });
  }

  edit(selectedItem: any) {
    const that = this;
    const dialogRef = that.dialog.open(EditGenericMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        setting: that.setting,
        fyleValue: selectedItem.source.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.getMappings();
    });
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getMappings() {
    const that = this;
    that.mappingsService.getMappings(that.setting.source_field).subscribe(mappings => {
      that.mappings = mappings.results;
      that.isLoading = false;
      const onboarded = that.storageService.get('onboarded');

        if (onboarded === false) {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
    });
  }

  goToConfigurations() {
    this.router.navigate([`/workspaces/${this.workspaceId}/settings/configurations/general/`]);
  }

  ngOnInit() {
    const that = this;
    that.route.params.subscribe(val => {
      that.isLoading = true;
      that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
      that.source_field = that.route.snapshot.params.source_field;
      that.settingsService.getMappingSettings(that.workspaceId).subscribe(response => {
        that.setting = response.results.filter(setting => setting.source_field === that.source_field.toUpperCase())[0];
        that.getMappings();
      });
    });

  }

}