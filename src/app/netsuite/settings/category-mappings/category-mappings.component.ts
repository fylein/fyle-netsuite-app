import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryMappingsDialogComponent } from './category-mappings-dialog/category-mappings-dialog.component';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-category-mappings',
  templateUrl: './category-mappings.component.html',
  styleUrls: ['./category-mappings.component.scss', '../settings.component.scss', '../../netsuite.component.scss']
})
export class CategoryMappingsComponent implements OnInit {
  isLoading = false;
  workspaceId: number;
  categoryMappings: any[];
  categoryCCCMappings: any[] = [];
  generalSettings: any;
  columnsToDisplay = ['category', 'netsuite'];

  constructor(
    private mappingsService: MappingsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private storageService: StorageService) { }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(CategoryMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
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


  getCategoryMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings('CATEGORY').subscribe(categoryMappings => {
      that.categoryCCCMappings = [];
      that.categoryMappings = categoryMappings.results;
      const accountMappings = that.categoryMappings.filter(mappings => mappings.destination.attribute_type === 'ACCOUNT');
      accountMappings.forEach(mapping => {
        var netsuiteValue = that.categoryMappings.filter(currentMapping => currentMapping.source.value === mapping.source.value && currentMapping.destination.attribute_type === 'ACCOUNT')[0];
        var cccValue = that.categoryMappings.filter(currentMapping => currentMapping.source.value === mapping.source.value && currentMapping.destination.attribute_type === 'CCC_ACCOUNT')[0];
        that.categoryCCCMappings.push({
          fyle_value: mapping.source.value,
          netsuite_value: netsuiteValue.destination.value,
          ccc_value: cccValue? cccValue.destination.value : ''
        });
      });
      that.isLoading = false;
    }, () => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.parent.snapshot.params.workspace_id;
    that.generalSettings = that.storageService.get('generalSettings');
    if (that.generalSettings.reimbursable_expenses_object == 'EXPENSE REPORT' && that.generalSettings.corporate_credit_card_expenses_object !== 'EXPENSE REPORT') {
      that.columnsToDisplay.push('ccc');
    }
    that.getCategoryMappings();
  }

}
