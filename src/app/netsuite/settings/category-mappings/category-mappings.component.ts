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
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-category-mappings',
  templateUrl: './category-mappings.component.html',
  styleUrls: ['./category-mappings.component.scss', '../settings.component.scss', '../../netsuite.component.scss']
})
export class CategoryMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  categoryMappings: Mapping[];
  categoryMappingRows: MatTableDataSource<MappingRow> = new MatTableDataSource([]);
  generalSettings: GeneralSetting;
  rowElement: Mapping;
  count: number;
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
        const data = {
          pageSize: (that.storageService.get('mappings.pageSize') || 50) * (that.columnsToDisplay.includes('ccc') ? 2 : 1),
          pageNumber: 0,
          tableDimension: that.columnsToDisplay.includes('ccc') ? 3 : 2
        };
        that.getCategoryMappings(data);
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    });
  }

  applyFilter(event: Event) {
    const that = this;
    const filterValue = (event.target as HTMLInputElement).value;
    that.categoryMappingRows.filter = filterValue.trim().toLowerCase();
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

  getCategoryMappings(data) {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(data.pageSize, data.pageSize * data.pageNumber, 'CATEGORY', data.tableDimension).subscribe(response => {
      that.categoryMappings = response.results;
      that.count = that.columnsToDisplay.includes('ccc') ?  response.count / 2 : response.count;
      const mappings = [];

      const categoryMappings = that.categoryMappings.filter(mapping => mapping.destination_type !== 'CCC_ACCOUNT' && mapping.destination_type !== 'CCC_EXPENSE_CATEGORY');

      categoryMappings.forEach(categoryMapping => {
        mappings.push({
          fyle_value: categoryMapping.source.value,
          auto_mapped: categoryMapping.source.auto_mapped,
          netsuite_value: categoryMapping.destination.value,
          ccc_value: that.getCCCAccount(that.categoryMappings, categoryMapping)
        });
      });
      that.categoryMappingRows = new MatTableDataSource(mappings);
      that.categoryMappingRows.filterPredicate = that.searchByText;
      that.isLoading = false;
    }, () => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }

  getCCCAccount(categoryMappings, categoryMapping) {
    const categMapping = categoryMappings.filter(mapping => mapping.source.value === categoryMapping.source.value && (mapping.destination_type === 'CCC_ACCOUNT' || mapping.destination_type === 'CCC_EXPENSE_CATEGORY'));

    return categMapping.length ? categMapping[0].destination.value : null;
  }

  searchByText(data: MappingRow, filterText: string) {
    return data.fyle_value.toLowerCase().includes(filterText) ||
    data.netsuite_value.toLowerCase().includes(filterText) ||
    (data.ccc_value ? data.ccc_value.toLowerCase().includes(filterText) : false);
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
      const data = {
        pageSize: (that.columnsToDisplay.includes('ccc') ? 2 : 1) * (that.storageService.get('mappings.pageSize') || 50),
        pageNumber: 0,
        tableDimension: that.columnsToDisplay.includes('ccc') ? 3 : 2
      };
      that.getCategoryMappings(data);
    });
  }
}
