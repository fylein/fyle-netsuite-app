import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { GeneralMapping } from 'src/app/core/models/general-mapping.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';

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
  accountsPayableIsValid = true;
  vendorPaymentAccountIsValid = true;
  bankAccountIsValid = true;
  cccAccountIsValid = true;
  locationIsValid = true;
  vendorIsValid = true;

  constructor(
    private route: ActivatedRoute,
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private storageService: StorageService) {
  }

  submit() {
    const that = this;
    that.accountsPayableIsValid = false;
    that.bankAccountIsValid = false;
    that.cccAccountIsValid = false;
    that.vendorPaymentAccountIsValid = false;
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

    if (accountPayableAccountId != null) {
      that.accountsPayableIsValid = true;
    }
    if (bankAccountId != null) {
      that.bankAccountIsValid = true;
    }
    if (vendorPaymentAccountId != null) {
      that.vendorPaymentAccountIsValid = true;
    }
    if (cccAccountId != null) {
      that.cccAccountIsValid = true;
    }
    if (defaultVendorId != null) {
      that.vendorIsValid = true;
    }
    if (locationId != null) {
      that.locationIsValid = true;
    }
    if (locationId === null) {
      that.locationIsValid = true;
    }

    if (cccAccountId === null) {
      that.cccAccountIsValid = true;
    }

    if (that.locationIsValid && that.vendorIsValid && that.accountsPayableIsValid && that.bankAccountIsValid && that.cccAccountIsValid && that.vendorPaymentAccountIsValid) {
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
        location_level: (netsuiteLocation && netsuiteLocationLevel) ? netsuiteLocationLevel : (netsuiteLocation) ? 'ALL'  : null
      };
      that.mappingsService.postGeneralMappings(generalMappings).subscribe(() => {
        const onboarded = that.storageService.get('onboarded');
        if (onboarded === true) {
          that.getGeneralMappings();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
      }, error => {
        that.isLoading = false;
        that.snackBar.open('Please fill up the form with valid values');
        that.form.markAllAsTouched();
      });
    } else {
      that.snackBar.open('Please fill up the form with valid values');
      that.form.markAllAsTouched();
    }
  }

  getGeneralMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getGeneralMappings().subscribe(generalMappings => {
      that.generalMappings = generalMappings;
      that.isLoading = false;
      that.checkLocationLevel(that.generalMappings.location_id);
      that.form = that.formBuilder.group({
        netsuiteLocationLevels : [this.generalMappings ? this.generalMappings.location_level : ''],
        netsuiteLocations: [this.generalMappings ? this.generalMappings.location_id : ''],
        accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
        vendorPaymentAccounts: [that.generalMappings ? that.generalMappings.vendor_payment_account_id : ''],
        bankAccounts: [that.generalMappings ? that.generalMappings.reimbursable_account_id : ''],
        cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : ''],
        netsuiteVendors: [that.generalMappings ? that.generalMappings.default_ccc_vendor_id : '']
      });
      that.form.controls.netsuiteLocations.valueChanges.subscribe((locationMappedTo) => {
        that.checkLocationLevel(locationMappedTo);
      });
    }, error => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        netsuiteLocationLevels : [null],
        netsuiteLocations: [null],
        accountPayableAccounts: [null],
        vendorPaymentAccounts: [null],
        bankAccounts: [null],
        cccAccounts: [null],
        netsuiteVendors: [null]
      });
      that.form.controls.netsuiteLocations.valueChanges.subscribe((locationMappedTo) => {
        that.checkLocationLevel(locationMappedTo);
      });
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.mappingsService.getNetSuiteDestinationAttributes('BANK_ACCOUNT'),
        that.mappingsService.getNetSuiteDestinationAttributes('CREDIT_CARD_ACCOUNT'),
        that.mappingsService.getNetSuiteDestinationAttributes('ACCOUNTS_PAYABLE'),
        that.mappingsService.getNetSuiteDestinationAttributes('LOCATION'),
        that.mappingsService.getNetSuiteDestinationAttributes('VENDOR'),
        that.mappingsService.getNetSuiteDestinationAttributes('VENDOR_PAYMENT_ACCOUNT')
      ]
    ).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses[0];
      if (that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
        that.cccAccounts = responses[1].filter(account => {
          // existing accounts might not have account_type, remove this later
          if (account.detail && 'account_type' in account.detail) {
            return account.detail.account_type === '_creditCard';
          }
        });
      } else {
        that.cccAccounts = responses[1];
      }
      that.accountPayableAccounts = responses[2];
      that.netsuiteLocations = responses[3];
      that.netsuiteVendors = responses[4];
      that.vendorPaymentAccounts = responses[5];
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
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe(settings => {
      that.generalSettings = settings;
      that.isLoading = false;
      that.reset();
    });
  }
}
