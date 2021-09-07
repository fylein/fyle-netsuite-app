import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MappingModal } from 'src/app/core/models/mapping-modal.model';
import { MappingSource } from 'src/app/core/models/mapping-source.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';
import { EmployeeMapping } from 'src/app/core/models/employee-mapping.model';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-employee-mappings-dialog',
  templateUrl: './employee-mappings-dialog.component.html',
  styleUrls: ['./employee-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class EmployeeMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  workSpaceId: number;
  fyleEmployees: MappingSource[];
  netsuiteEmployees: MappingDestination[];
  cccObjects: MappingDestination[];
  netsuiteVendors: MappingDestination[];
  generalSettings: GeneralSetting;
  employeeOptions: MappingSource[];
  netsuiteEmployeeOptions: MappingDestination[];
  cccOptions: MappingDestination[];
  netsuiteVendorOptions: MappingDestination[];
  generalMappings: GeneralMapping;
  editMapping: boolean;

  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EmployeeMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MappingModal,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar,
              private settingsService: SettingsService
            ) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    const that = this;
    const fyleEmployee = that.form.getRawValue().fyleEmployee;
    const netsuiteVendor = that.form.getRawValue().netsuiteVendor;
    const netsuiteEmployee = that.form.getRawValue().netsuiteEmployee;
    const creditCardAccount = that.form.getRawValue().creditCardAccount;

    if (that.form.valid && (netsuiteVendor || netsuiteEmployee || creditCardAccount)) {
      const employeeMapping: EmployeeMapping = {
        source_employee: {
          id: fyleEmployee.id
        },
        destination_vendor: {
          id: netsuiteVendor ? netsuiteVendor.id : null
        },
        destination_employee: {
          id: netsuiteEmployee ? netsuiteEmployee.id : null
        },
        destination_card_account: {
          id: creditCardAccount ? creditCardAccount.id : null
        },
        workspace: that.workSpaceId
      };
      that.isLoading = true;

      that.mappingsService.postEmployeeMappings(employeeMapping).subscribe(() => {
        that.snackBar.open('Employee Mapping saved successfully');
        that.isLoading = false;
        that.dialogRef.close();
      }, err => {
        that.snackBar.open('Something went wrong');
        that.isLoading = false;
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.form.markAllAsTouched();
    }
  }

  forbiddenSelectionValidator(options: (MappingSource|MappingDestination)[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: object } | null => {
      if (control.value) {
        const forbidden = !options.some((option) => {
          return control.value && control.value.id && option && option.id === control.value.id;
        });
        return forbidden ? {
          forbiddenOption: {
            value: control.value
          }
        } : null;
      }

      return null;
    };
  }

  setupFyleEmployeeAutocompleteWatcher() {
    const that = this;
    that.form.controls.fyleEmployee.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.employeeOptions = that.fyleEmployees
          .filter(fyleEmployee => new RegExp(newValue.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase()));
      }
    });
  }

  setupnetsuiteVendorAutocompleteWatcher() {
    const that = this;

    that.form.controls.netsuiteVendor.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.netsuiteVendorOptions = that.netsuiteVendors
          .filter(netsuiteVendor => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteVendor.value.toLowerCase()));
      }
    });
  }

  setupnetsuiteEmployeesWatcher() {
    const that = this;

    that.form.controls.netsuiteEmployee.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.netsuiteEmployeeOptions = that.netsuiteEmployees
          .filter(netsuiteEmployee => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteEmployee.value.toLowerCase()));
      }
    });
  }

  setupCCCAutocompleteWatcher() {
    const that = this;

    that.form.controls.creditCardAccount.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.cccOptions = that.cccObjects
          .filter(cccObject => new RegExp(newValue.toLowerCase(), 'g').test(cccObject.value.toLowerCase()));
      }
    });
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleEmployeeAutocompleteWatcher();
    that.setupnetsuiteVendorAutocompleteWatcher();
    that.setupnetsuiteEmployeesWatcher();
    that.setupCCCAutocompleteWatcher();
  }

  getAttributesFilteredByConfig() {
    const that = this;
    const attributes = [];

    if (that.generalSettings.employee_field_mapping === 'VENDOR') {
      attributes.push('VENDOR');
    } else if (that.generalSettings.employee_field_mapping === 'EMPLOYEE') {
      attributes.push('EMPLOYEE');
    }

    if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') {
      attributes.push('CREDIT_CARD_ACCOUNT');
    }

    return attributes;
  }

  reset() {
    const that = this;
    that.isLoading = true;

    const attributes = that.getAttributesFilteredByConfig();
    forkJoin([
      that.mappingsService.getFyleExpenseAttributes('EMPLOYEE'),
      that.mappingsService.getGroupedNetSuiteDestinationAttributes(attributes),
      that.mappingsService.getGeneralMappings()
    ]).subscribe(res => {
      that.fyleEmployees = res[0];
      that.netsuiteEmployees = res[1].EMPLOYEE;

      if (that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
        that.cccObjects = res[1].CREDIT_CARD_ACCOUNT.filter(account => {
          // existing accounts might not have account_type, remove this later
          if (account.detail && 'account_type' in account.detail) {
            return account.detail.account_type === '_creditCard';
          }
        });
      } else {
        that.cccObjects = res[1].CREDIT_CARD_ACCOUNT;
      }

      that.netsuiteVendors = res[1].VENDOR;
      that.generalMappings = res[2];

      const fyleEmployee = that.editMapping ? that.fyleEmployees.filter(employee => employee.value === that.data.employeeMappingRow.source_employee.value)[0] : '';
      const netsuiteVendor = that.editMapping ? that.netsuiteVendors.filter(vendor => that.data.employeeMappingRow.destination_vendor && vendor.value === that.data.employeeMappingRow.destination_vendor.value)[0] : '';
      const netsuiteEmployee = that.editMapping ? that.netsuiteEmployees.filter(employee => that.data.employeeMappingRow.destination_employee && employee.value === that.data.employeeMappingRow.destination_employee.value)[0] : '';
      const defaultCCCObj = that.editMapping ? that.cccObjects.filter(cccObj => that.data.employeeMappingRow.destination_card_account && cccObj.value === that.data.employeeMappingRow.destination_card_account.value)[0] : that.cccObjects.filter(cccObj => cccObj.value === that.generalMappings.default_ccc_account_name)[0];
      that.isLoading = false;
      that.form = that.formBuilder.group({
        fyleEmployee: [fyleEmployee, Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleEmployees)])],
        netsuiteVendor: [netsuiteVendor, that.generalSettings.employee_field_mapping === 'VENDOR' ? that.forbiddenSelectionValidator(that.netsuiteVendors) : ''],
        netsuiteEmployee: [netsuiteEmployee, that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.forbiddenSelectionValidator(that.netsuiteEmployees) : ''],
        creditCardAccount: [defaultCCCObj || '', (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') ? that.forbiddenSelectionValidator(that.cccObjects) : null]
      });

      if (that.editMapping) {
        that.form.controls.fyleEmployee.disable();
      }

      that.setupAutocompleteWatchers();
    });
  }

  ngOnInit() {
    const that = this;

    if (that.data.employeeMappingRow) {
      that.editMapping = true;
    }

    that.workSpaceId = that.data.workspaceId;
    that.isLoading = true;
    that.settingsService.getGeneralSettings().subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }

}
