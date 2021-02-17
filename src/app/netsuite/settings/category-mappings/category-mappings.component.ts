import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryMappingsDialogComponent } from './category-mappings-dialog/category-mappings-dialog.component';
import { StorageService } from 'src/app/core/services/storage.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { Mapping } from 'src/app/core/models/mappings.model';
import { MappingRow } from 'src/app/core/models/mapping-row.model';

@Component({
  selector: 'app-category-mappings',
  templateUrl: './category-mappings.component.html',
  styleUrls: ['./category-mappings.component.scss', '../settings.component.scss', '../../netsuite.component.scss']
})
export class CategoryMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  categoryMappings: Mapping[];
  categoryMappingRows: MappingRow[];
  generalSettings: GeneralSetting;
  rowElement: Mapping;
  columnsToDisplay = ['category', 'netsuite'];

  constructor(
    private mappingsService: MappingsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private settingsService: SettingsService,
    private storageService: StorageService) { }

  open(selectedItem: MappingRow = null) {
    const that = this;
    const dialogRef = that.dialog.open(CategoryMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        rowElement: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const onboarded = that.storageService.get('onboarded');
      if (onboarded === true) {
        that.getCategoryMappings();
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    });
  }

  showSeparateCCCField() {
    const that = this;
    if (that.generalSettings.corporate_credit_card_expenses_object) {
      if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' || that.generalSettings.corporate_credit_card_expenses_object === 'EXPENSE REPORT') {
        if (that.generalSettings.reimbursable_expenses_object !== that.generalSettings.corporate_credit_card_expenses_object) {
          return true;
        }
      }
    }
    return false;
  }

  getCategoryMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getAllMappings('CATEGORY').subscribe(response => {
      that.categoryMappings = response.results;
      const mappings = [];

      const categoryMappings = that.categoryMappings.filter(mapping => mapping.destination_type !== 'CCC_ACCOUNT' && mapping.destination_type !== 'CCC_EXPENSE_CATEGORY');

      categoryMappings.forEach(categoryMapping => {
        mappings.push({
          fyle_value: categoryMapping.source.value,
          netsuite_value: categoryMapping.destination.value,
          ccc_value: that.getCCCAccount(that.categoryMappings, categoryMapping)
        });
      });
      that.categoryMappingRows = mappings;
      that.isLoading = false;
    }, () => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }

  getCCCAccount(categoryMappings, categoryMapping) {
    const categMapping = categoryMappings.filter(mapping => mapping.source.value === categoryMapping.source.value && (mapping.destination_type === 'CCC_ACCOUNT' || mapping.destination_type === 'CCC_EXPENSE_CATEGORY'));

    return categMapping.length ? categMapping[0].destination.value : null;
  }

  ngOnInit() {
    const that = this;
    this.isLoading = true;
    that.workspaceId = that.route.parent.snapshot.params.workspace_id;
    that.settingsService.getGeneralSettings(this.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      this.isLoading = false;

      if (that.showSeparateCCCField()) {
        that.columnsToDisplay.push('ccc');
      }

      that.getCategoryMappings();
    });
  }

}
