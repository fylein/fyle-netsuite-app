import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryMappingsDialogComponent } from './category-mappings-dialog/category-mappings-dialog.component';
import { StorageService } from 'src/app/core/services/storage.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MatTableDataSource } from '@angular/material';
import { CategoryMapping } from 'src/app/core/models/category-mapping.model';
import { CategoryMappingsResponse } from 'src/app/core/models/category-mapping-response.model';

@Component({
  selector: 'app-category-mappings',
  templateUrl: './category-mappings.component.html',
  styleUrls: ['./category-mappings.component.scss', '../settings.component.scss', '../../netsuite.component.scss']
})
export class CategoryMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  categoryMappings: CategoryMapping[];
  categoryMappingRows: MatTableDataSource<CategoryMapping> = new MatTableDataSource([]);
  generalSettings: GeneralSetting;
  pageNumber = 0;
  count: number;
  columnsToDisplay = ['category', 'netsuite'];

  constructor(
    private mappingsService: MappingsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private settingsService: SettingsService,
    private storageService: StorageService) { }

  open(selectedItem: CategoryMapping = null) {
    const that = this;
    const dialogRef = that.dialog.open(CategoryMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        categoryMappingRow: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      const onboarded = that.storageService.get('onboarded');
      if (onboarded) {
        const data = {
          pageSize: that.storageService.get('mappings.pageSize') || 50,
          pageNumber: 0
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

    that.mappingsService.getCategoryMappings(data.pageSize, data.pageSize * data.pageNumber).subscribe((response: CategoryMappingsResponse) => {
      that.categoryMappings = response.results;
      that.count = response.count;
      that.pageNumber = data.pageNumber;
      that.categoryMappingRows = new MatTableDataSource(that.categoryMappings);
      that.categoryMappingRows.filterPredicate = that.searchByText;
      that.isLoading = false;
    });
  }

  searchByText(data: CategoryMapping, filterText: string) {
    return data.source_category.value.toLowerCase().includes(filterText) ||
    (data.destination_account ? data.destination_account.value.toLowerCase().includes(filterText) : false) ||
    (data.destination_expense_head ? data.destination_expense_head.value.toLowerCase().includes(filterText) : false);
  }

  ngOnInit() {
    const that = this;
    this.isLoading = true;
    that.workspaceId = that.route.parent.snapshot.params.workspace_id;
    that.settingsService.getGeneralSettings().subscribe(settings => {
      that.generalSettings = settings;
      this.isLoading = false;

      if (that.showSeparateCCCField()) {
        that.columnsToDisplay.push('ccc');
      }
      const data = {
        pageSize: that.storageService.get('mappings.pageSize') || 50,
        pageNumber: 0
      };
      that.getCategoryMappings(data);
    });
  }
}
