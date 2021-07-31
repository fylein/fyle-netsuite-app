import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog/employee-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mapping } from 'src/app/core/models/mappings.model';
import { MappingRow } from 'src/app/core/models/mapping-row.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-mappings',
  templateUrl: './employee-mappings.component.html',
  styleUrls: ['./employee-mappings.component.scss', '../settings.component.scss', '../../netsuite.component.scss']
})
export class EmployeeMappingsComponent implements OnInit {

  form: FormGroup;
  employeeMappings: Mapping[];
  employeeMappingRows: MatTableDataSource<MappingRow> = new MatTableDataSource([]);
  workspaceId: number;
  isLoading = true;
  generalSettings: GeneralSetting;
  rowElement: Mapping;
  pageNumber = 0;
  count: number;
  columnsToDisplay = ['employee_email', 'netsuite'];

  constructor(public dialog: MatDialog,
              private route: ActivatedRoute,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar,
              private router: Router,
              private settingsService: SettingsService,
              private storageService: StorageService
            ) { }

  open(selectedItem: MappingRow = null) {
    const that = this;
    const dialogRef = that.dialog.open(EmployeeMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        rowElement: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.isLoading = true;
      const tableDimension = that.columnsToDisplay.includes('ccc') ? 3 : 2;
      const pageSize = (that.storageService.get('mappings.pageSize') || 50) * (that.columnsToDisplay.includes('ccc') ? 2 : 1);
      that.mappingsService.getMappings(pageSize, 0, 'EMPLOYEE', tableDimension).subscribe((employees) => {
        that.count = that.columnsToDisplay.includes('ccc') ? employees.count / 2 : employees.count;
        that.pageNumber = 0;
        that.employeeMappings = employees.results;
        that.isLoading = false;
        const onboarded = that.storageService.get('onboarded');

        if (onboarded) {
          that.createEmployeeMappingsRows();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      });
    });
  }

  applyFilter(event: Event) {
    const that = this;
    const filterValue = (event.target as HTMLInputElement).value;
    that.employeeMappingRows.filter = filterValue.trim().toLowerCase();
  }

  createEmployeeMappingsRows() {
    const that = this;
    const employeeEVMappings = that.employeeMappings.filter(mapping => mapping.destination_type !== 'CREDIT_CARD_ACCOUNT');
    const mappings = [];

    employeeEVMappings.forEach(employeeEVMapping => {
      mappings.push({
        fyle_value: employeeEVMapping.source.value,
        netsuite_value: employeeEVMapping.destination.value,
        ccc_value: that.getCCCAccount(that.employeeMappings, employeeEVMapping),
        auto_mapped: employeeEVMapping.source.auto_mapped
      });
    });
    that.employeeMappingRows = new MatTableDataSource(mappings);
    that.employeeMappingRows.filterPredicate = that.searchByText;
  }

  getCCCAccount(employeeMappings, employeeEVMapping) {
    const empMapping = employeeMappings.filter(evMapping => evMapping.destination_type === 'CREDIT_CARD_ACCOUNT' && evMapping.source.value === employeeEVMapping.source.value);

    return empMapping.length ? empMapping[0].destination.value : null;
  }

  reset(data) {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(data.pageSize, data.pageNumber * data.pageSize, 'EMPLOYEE', data.tableDimension).subscribe((employees) => {
      that.employeeMappings = employees.results;
      that.pageNumber = data.pageNumber;
      that.count = that.columnsToDisplay.includes('ccc') ? employees.count / 2 : employees.count;
      that.createEmployeeMappingsRows();
      that.isLoading = false;
    });
  }

  triggerAutoMapEmployees() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.triggerAutoMapEmployees().subscribe(() => {
      that.isLoading = false;
      that.snackBar.open('Auto mapping of employees may take few minutes to complete');
    }, error => {
      that.isLoading = false;
      that.snackBar.open(error.error.message);
    });
  }

  searchByText(data: MappingRow, filterText: string) {
    return data.fyle_value.toLowerCase().includes(filterText) ||
    data.netsuite_value.toLowerCase().includes(filterText) ||
    (data.ccc_value ? data.ccc_value.toLowerCase().includes(filterText) : false);
  }

  mappingsCheck() {
    const that = this;
    that.mappingsService.getGeneralMappings().subscribe(res => {
      // Do nothing
    }, () => {
      that.snackBar.open('You cannot access this page yet. Please follow the onboarding steps in the dashboard or refresh your page');
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.mappingsCheck();
      that.isLoading = false;
      if (that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' && that.generalSettings.corporate_credit_card_expenses_object) {
        that.columnsToDisplay.push('ccc');
      }
      const data = {
        pageSize: (that.columnsToDisplay.includes('ccc') ? 2 : 1) * (that.storageService.get('mappings.pageSize') || 50),
        pageNumber: 0,
        tableDimension: that.columnsToDisplay.includes('ccc') ? 3 : 2
      };
      that.reset(data);
    }, () => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
  }
}
