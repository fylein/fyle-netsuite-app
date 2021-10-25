import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { GroupedDestinationAttributes } from 'src/app/core/models/grouped-destination-attributes';

@Component({
  selector: 'app-general-mappings',
  templateUrl: './general-mappings.component.html',
  styleUrls: ['./general-mappings.component.scss', '../../netsuite.component.scss']
})
export class GeneralMappingsComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  netsuiteLocations: MappingDestination[];
  showLocationLevelOption: boolean;
  netsuiteVendors: MappingDestination[];
  accountPayableAccounts: MappingDestination[];
  bankAccounts: MappingDestination[];
  vendorPaymentAccounts: MappingDestination[];
  cccAccounts: MappingDestination[];
  generalMappings: GeneralMapping;
  generalSettings: GeneralSetting;
  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private storageService: StorageService) {
  }

  redirectHandler() {
    const that = this;

    that.route.queryParams.subscribe(params => {
      if (params.redirect_to_employee_mappings) {
        setTimeout(() => {
          const destination = that.generalSettings.employee_field_mapping.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
          that.snackBar.open(`To ensure successful export, map Fyle Employees to ${destination}s in NetSuite`, '', {
            duration: 7000
          });
          return that.router.navigateByUrl(`workspaces/${that.workspaceId}/settings/employee/mappings`);
        }, 1000);
      } else {
        const onboarded = that.storageService.get('onboarded');
        if (!onboarded) {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        } else {
          that.isLoading = false;
        }
      }
    });
  }

  submit() {
    const that = this;
    const formValues = this.form.getRawValue();

    const locationId = formValues ? formValues.netsuiteLocations : this.form.value.netsuiteLocations;
    const netsuiteLocation = this.netsuiteLocations.filter(filteredLocation => filteredLocation.destination_id === locationId)[0];

    const netsuiteLocationLevel = formValues ? formValues.netsuiteLocationLevels : this.form.value.netsuiteLocationLevels;

    const accountPayableAccountId = (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') ? that.form.value.accountPayableAccounts : '';
    const accountPayableAccount: MappingDestination = (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') ? that.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === accountPayableAccountId)[0] : null;

    const vendorPaymentAccountId = that.generalSettings.sync_fyle_to_netsuite_payments ? that.form.value.vendorPaymentAccounts : '';
    const vendorPaymentAccount: MappingDestination = that.generalSettings.sync_fyle_to_netsuite_payments ? that.vendorPaymentAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === vendorPaymentAccountId)[0] : null;

    const bankAccountId = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.form.value.bankAccounts : '';
    const bankAccount: MappingDestination = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : null;

    const cccAccountId = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.form.value.cccAccounts : '';
    const cccAccount = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    const defaultVendorId = (that.generalSettings.corporate_credit_card_expenses_object === 'BILL' || that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') ? that.form.value.netsuiteVendors : '';
    const defaultVendor: MappingDestination = (that.generalSettings.corporate_credit_card_expenses_object === 'BILL' || that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') ? that.netsuiteVendors.filter(filteredVendor => filteredVendor.destination_id === defaultVendorId)[0] : null;

    let departmentLevel = null;
    if (that.form.value.useDefaultEmployeeDepartment) {
      departmentLevel = formValues.netsuiteDepartmentLevels ? formValues.netsuiteDepartmentLevels : 'ALL';
    }

    that.isLoading = true;
    const generalMappings: GeneralMapping = {
      location_name: netsuiteLocation ? netsuiteLocation.value : null,
      location_id: netsuiteLocation ? netsuiteLocation.destination_id : null,
      accounts_payable_name: accountPayableAccount ? accountPayableAccount.value : null,
      accounts_payable_id: accountPayableAccount ? accountPayableAccount.destination_id : null,
      reimbursable_account_name: bankAccount ? bankAccount.value : null,
      reimbursable_account_id: bankAccount ? bankAccount.destination_id : null,
      default_ccc_account_name: cccAccount ? cccAccount.value : null,
      default_ccc_account_id: cccAccount ? cccAccount.destination_id : null,
      vendor_payment_account_name: vendorPaymentAccount ? vendorPaymentAccount.value : null,
      vendor_payment_account_id: vendorPaymentAccount ? vendorPaymentAccount.destination_id : null,
      default_ccc_vendor_name: defaultVendor ? defaultVendor.value : null,
      default_ccc_vendor_id: defaultVendor ? defaultVendor.destination_id : null,
      location_level: (netsuiteLocation && netsuiteLocationLevel) ? netsuiteLocationLevel : (netsuiteLocation) ? 'ALL'  : null,
      department_level: departmentLevel,
      use_employee_department: that.form.value.useDefaultEmployeeDepartment,
      use_employee_class: that.form.value.useDefaultEmployeeClass,
      use_employee_location: that.form.value.useDefaultEmployeeLocation,
      workspace: that.workspaceId
    };
    that.mappingsService.postGeneralMappings(generalMappings).subscribe(() => {
      that.snackBar.open('General Mappings saved successfully');
      that.redirectHandler();
    }, () => {
      that.isLoading = false;
      that.snackBar.open('Please fill up the form with valid values');
      that.form.markAllAsTouched();
    });
  }

  setMandatoryFields() {
    const that = this;
    if (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') {
      that.form.controls.accountPayableAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.employee_field_mapping === 'EMPLOYEE') {
      that.form.controls.bankAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') {
      that.form.controls.cccAccounts.setValidators(Validators.required);
    }

    if (that.generalSettings.corporate_credit_card_expenses_object === 'BILL' || that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
      that.form.controls.netsuiteVendors.setValidators(Validators.required);
    }

    if (that.generalSettings.sync_fyle_to_netsuite_payments) {
      that.form.controls.vendorPaymentAccounts.setValidators(Validators.required);
    }

    if (that.generalMappings) {
      that.form.markAllAsTouched();
    }
  }

  isFieldMandatory(controlName: string) {
    const abstractControl = this.form.controls[controlName];
    if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }

    return false;
  }

  getGeneralMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getGeneralMappings().subscribe(generalMappings => {
      that.generalMappings = generalMappings;
      that.isLoading = false;
      that.checkLocationLevel(that.generalMappings.location_id);

      // if CCC export is updated to Credit Card Charge, we limit the CCC account choices with _creditCard account type
      const defaultCCCAccount = that.cccAccounts.filter(cccAccount => cccAccount.destination_id === generalMappings.default_ccc_account_id);

      that.form = that.formBuilder.group({
        netsuiteLocationLevels : [this.generalMappings ? this.generalMappings.location_level : ''],
        netsuiteLocations: [this.generalMappings ? this.generalMappings.location_id : ''],
        accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
        vendorPaymentAccounts: [that.generalMappings ? that.generalMappings.vendor_payment_account_id : ''],
        bankAccounts: [that.generalMappings ? that.generalMappings.reimbursable_account_id : ''],
        cccAccounts: [that.generalMappings && defaultCCCAccount.length ? that.generalMappings.default_ccc_account_id : ''],
        netsuiteVendors: [that.generalMappings ? that.generalMappings.default_ccc_vendor_id : ''],
        useDefaultEmployeeDepartment: [that.generalMappings && that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.generalMappings.use_employee_department : false],
        useDefaultEmployeeClass: [that.generalMappings && that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.generalMappings.use_employee_class : false],
        useDefaultEmployeeLocation: [that.generalMappings && that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.generalMappings.use_employee_location : false],
        netsuiteDepartmentLevels : [this.generalMappings ? this.generalMappings.department_level : ''],
      });

      that.setMandatoryFields();

      that.form.controls.netsuiteLocations.valueChanges.subscribe((locationMappedTo) => {
        that.checkLocationLevel(locationMappedTo);
      });
    }, () => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        netsuiteLocationLevels : [null],
        netsuiteLocations: [null],
        accountPayableAccounts: [null],
        vendorPaymentAccounts: [null],
        bankAccounts: [null],
        cccAccounts: [null],
        netsuiteVendors: [null],
        useDefaultEmployeeDepartment: [false],
        useDefaultEmployeeClass: [false],
        useDefaultEmployeeLocation: [false],
        netsuiteDepartmentLevels: [null]
      });

      that.setMandatoryFields();

      that.form.controls.netsuiteLocations.valueChanges.subscribe((locationMappedTo) => {
        that.checkLocationLevel(locationMappedTo);
      });
    });
  }

  getAttributesFilteredByConfig() {
    const that = this;

    const attributes = ['LOCATION'];
    if (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') {
      attributes.push('ACCOUNTS_PAYABLE');
    }
    if (that.generalSettings.employee_field_mapping === 'EMPLOYEE') {
      attributes.push('BANK_ACCOUNT');
    }
    if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object !== 'BILL') {
      attributes.push('CREDIT_CARD_ACCOUNT');
    }
    if (that.generalSettings.corporate_credit_card_expenses_object === 'BILL' || that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
      attributes.push('VENDOR');
    }
    if (that.generalSettings.sync_fyle_to_netsuite_payments) {
      attributes.push('VENDOR_PAYMENT_ACCOUNT');
    }

    return attributes;
  }

  reset() {
    const that = this;
    that.isLoading = true;

    const attributes = that.getAttributesFilteredByConfig();
    that.mappingsService.getGroupedNetSuiteDestinationAttributes(attributes).subscribe((response: GroupedDestinationAttributes) => {
      that.isLoading = false;
      that.bankAccounts = response.BANK_ACCOUNT;
      if (that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
        that.cccAccounts = response.CREDIT_CARD_ACCOUNT.filter(account => {
          // existing accounts might not have account_type, remove this later
          if (account.detail && 'account_type' in account.detail) {
            return account.detail.account_type === '_creditCard';
          }
        });
      } else {
        that.cccAccounts = response.CREDIT_CARD_ACCOUNT;
      }
      that.accountPayableAccounts = response.ACCOUNTS_PAYABLE;
      that.netsuiteLocations = response.LOCATION;
      that.netsuiteVendors = response.VENDOR;
      that.vendorPaymentAccounts = response.VENDOR_PAYMENT_ACCOUNT;
      that.getGeneralMappings();
    });
  }

  checkLocationLevel(netsuiteLocation) {
    const that = this;
    if (netsuiteLocation) {
      that.showLocationLevelOption = true;
    } else {
      that.showLocationLevelOption = false;
    }
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getGeneralSettings().subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
