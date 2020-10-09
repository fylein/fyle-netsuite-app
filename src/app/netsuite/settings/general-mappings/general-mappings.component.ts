import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../core/services/mappings.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-general-mappings',
  templateUrl: './general-mappings.component.html',
  styleUrls: ['./general-mappings.component.scss', '../../netsuite.component.scss']
})
export class GeneralMappingsComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  netsuiteLocations: any[]
  netsuiteVendors: any[]
  accountPayableAccounts: any[];
  bankAccounts: any[];
  cccAccounts: any[];
  generalMappings: any;
  generalSettings: any;
  isLoading = true;
  accountsPayableIsValid = true;
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

    let formValues = this.form.getRawValue()

    let locationId = formValues? formValues.netsuiteLocations: this.form.value.netsuiteLocations;
    let netsuiteLocation = this.netsuiteLocations.filter(filteredLocation => filteredLocation.destination_id === locationId)[0];

    const accountPayableAccountId = (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') ? that.form.value.accountPayableAccounts : '';
    const accountPayableAccount = (that.generalSettings.employee_field_mapping === 'VENDOR' || that.generalSettings.corporate_credit_card_expenses_object === 'BILL') ? that.accountPayableAccounts.filter(filteredAccountsPayableAccount => filteredAccountsPayableAccount.destination_id === accountPayableAccountId)[0] : '';

    const bankAccountId = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.form.value.bankAccounts : '';
    const bankAccount = that.generalSettings.employee_field_mapping === 'EMPLOYEE' ? that.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : '';

    let cccAccountId = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.form.value.cccAccounts : '';
    let cccAccount = that.generalSettings.corporate_credit_card_expenses_object !== 'BILL' ? that.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    const defaultVendorId = that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.form.value.netsuiteVendors : '';
    const defaultVendor = that.generalSettings.corporate_credit_card_expenses_object === 'BILL' ? that.netsuiteVendors.filter(filteredVendor => filteredVendor.destination_id === defaultVendorId)[0] : '';

    if (accountPayableAccountId != null) {
      that.accountsPayableIsValid = true;
    }
    if (bankAccountId != null) {
      that.bankAccountIsValid = true;
    }
    if (cccAccountId != null) {
      that.cccAccountIsValid = true;
    }
    if (defaultVendorId != null) {
      that.vendorIsValid = true;
    }
    if (locationId != null) {
      this.locationIsValid = true;
    }
    if (locationId === null) {
      this.locationIsValid = true;
      netsuiteLocation = {
        'value' : null,
        'destination_id': null
      }
    }
    if (cccAccountId === null) {
      this.cccAccountIsValid = true;
      cccAccount = {
        'value' : null,
        'destination_id': null
      }
    }

    const generalMappings = {
      location_name: netsuiteLocation.value,
      location_id: netsuiteLocation.destination_id,
      accounts_payable_name: accountPayableAccount.value,
      accounts_payable_id: accountPayableAccount.destination_id,
      reimbursable_account_name: bankAccount.value,
      reimbursable_account_id: bankAccount.destination_id,
      default_ccc_account_name: cccAccount.value,
      default_ccc_account_id: cccAccount.destination_id,
      default_ccc_vendor_name: defaultVendor.value,
      default_ccc_vendor_id: defaultVendor.destination_id
    };

    if (that.locationIsValid && that.vendorIsValid && that.accountsPayableIsValid && that.bankAccountIsValid && that.cccAccountIsValid) {
      that.isLoading = true;
      this.mappingsService.postGeneralMappings(generalMappings).subscribe(response => {
        const onboarded = that.storageService.get('onboarded');
        if (onboarded === true) {
          that.getGeneralMappings();
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
        }
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

      that.form = that.formBuilder.group({
        netsuiteLocations: [this.generalMappings? this.generalMappings.location_id: ''],
        accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
        bankAccounts: [that.generalMappings ? that.generalMappings.reimbursable_account_id : ''],
        cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : ''],
        netsuiteVendors: [that.generalMappings ? that.generalMappings.default_ccc_vendor_id : '']
      });
    }, error => {
      that.generalMappings = {};
      that.isLoading = false;
      that.form = that.formBuilder.group({
        netsuiteLocations: [this.netsuiteLocations? this.generalMappings.location_id: ''],
        accountPayableAccounts: [that.generalMappings ? that.generalMappings.accounts_payable_id : ''],
        bankAccounts: [that.generalMappings ? that.generalMappings.reimbursable_account_id : ''],
        cccAccounts: [that.generalMappings ? that.generalMappings.default_ccc_account_id : '',],
        netsuiteVendors: [that.generalMappings ? that.generalMappings.default_ccc_vendor_id : '']
      });
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    forkJoin(
      [
        that.mappingsService.getBankAccounts(),
        that.mappingsService.getCreditCardAccounts(),
        that.mappingsService.getAccountsPayables(),
        that.mappingsService.getNetSuiteLocations(),
        that.mappingsService.getNetSuiteVendors()
      ]
    ).subscribe(responses => {
      that.isLoading = false;
      that.bankAccounts = responses[0];
      that.cccAccounts = responses[1];
      that.accountPayableAccounts = responses[2];
      that.netsuiteLocations = responses[3]
      that.netsuiteVendors = responses[4]
      that.getGeneralMappings();
    });
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
