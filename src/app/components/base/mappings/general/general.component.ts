import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css', '../../base.component.css']
})
export class GeneralComponent implements OnInit {

  showModal = false;
  modalRef: NgbModalRef;
  closeResult: string;
  form: FormGroup;
  workspaceId: number;
  netsuiteLocations: any[]
  accountsPayableAccounts: any[]
  bankAccounts: any[]
  cccAccounts: any[]
  generalMappings: any;
  generalSettings: any;
  isLoading: boolean = true;
  locationIsValid: boolean = true;
  accountsPayableIsValid: boolean = true;
  bankAccountIsValid: boolean = true;
  cccAccountIsValid: boolean = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'generalSettingsModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  submit() {
    this.locationIsValid = false;
    this.accountsPayableIsValid = false;
    this.bankAccountIsValid = false;
    this.cccAccountIsValid = false;

    let formValues = this.form.getRawValue()

    let locationId = formValues? formValues.netsuiteLocations: this.form.value.netsuiteLocations;
    let netsuiteLocation = this.netsuiteLocations.filter(filteredLocation => filteredLocation.destination_id === locationId)[0];

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

    let accountId = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.form.value.accountsPayableAccounts: '';
    let accountsPayableAccount = this.generalSettings.employee_field_mapping === 'VENDOR' ? this.accountsPayableAccounts.filter(filteredAccount => filteredAccount.destination_id === accountId)[0]: '';

    let bankAccountId = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.form.value.bankAccounts : '';
    let bankAccount = this.generalSettings.employee_field_mapping === 'EMPLOYEE' ? this.bankAccounts.filter(filteredBankAccount => filteredBankAccount.destination_id === bankAccountId)[0] : '';

    let cccAccountId = this.generalSettings.corporate_credit_card_expenses_object ? this.form.value.cccAccounts: '';
    let cccAccount = this.generalSettings.corporate_credit_card_expenses_object ? this.cccAccounts.filter(filteredCCCAccount => filteredCCCAccount.destination_id === cccAccountId)[0] : '';

    if (accountId != null) {
      this.accountsPayableIsValid = true;
    }
    if (bankAccountId != null) {
      this.bankAccountIsValid = true;
    }
    if (cccAccountId != null) {
      this.cccAccountIsValid = true;
    }

    if(this.locationIsValid && this.accountsPayableIsValid && this.bankAccountIsValid && this.cccAccountIsValid){
      this.isLoading = true;
      this.mappingsService.postGeneralMappings(this.workspaceId, netsuiteLocation.value, netsuiteLocation.destination_id, accountsPayableAccount.value, accountsPayableAccount.destination_id, bankAccount.value, bankAccount.destination_id, cccAccount.value, cccAccount.destination_id).subscribe(response => {
        this.getGeneralMappings();
      });
    }
  }


  getGeneralMappings() {
    this.mappingsService.getGeneralMappings(this.workspaceId).subscribe(generalMappings => {
      this.generalMappings = generalMappings;
      this.isLoading = false;
      this.form = this.formBuilder.group({
        netsuiteLocations: [this.generalMappings? this.generalMappings.location_id: ''],
        accountsPayableAccounts: [this.generalMappings? this.generalMappings.accounts_payable_id: ''],
        bankAccounts: [this.generalMappings? this.generalMappings.reimbursable_account_id: ''],
        cccAccounts: [this.generalMappings? this.generalMappings.default_ccc_account_id: '']
      });
    }, error => {
      if(error.status == 400) {
        this.generalMappings = {};
        this.mappingsService.postNetSuiteLocations(this.workspaceId).subscribe(response => {
          this.netsuiteLocations = response
        });
        this.isLoading = false;
        this.form = this.formBuilder.group({
          netsuiteLocations: [this.netsuiteLocations? this.generalMappings.location_id: ''],
          accountsPayableAccounts: [this.generalMappings? this.generalMappings['accounts_payable_id']: ''],
          bankAccounts: [this.generalMappings? this.generalMappings['reimbursable_account_id']: ''],
          cccAccounts: [this.generalMappings? this.generalMappings['default_ccc_account_id']: '']
        });
      }
    });
  }


    ngOnInit() {
      this.route.parent.params.subscribe(params => {
        this.workspaceId = +params['workspace_id'];
        this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));
        forkJoin(
          [
            this.mappingsService.getNetSuiteLocations(this.workspaceId),
            this.mappingsService.getAccountsPayables(this.workspaceId),
            this.mappingsService.getBankAccounts(this.workspaceId),
            this.mappingsService.getCreditCardAccounts(this.workspaceId)
          ]
        ).subscribe(responses => {
          this.netsuiteLocations = responses[0]
          this.accountsPayableAccounts = responses[1]
          this.bankAccounts = responses[2]
          this.cccAccounts = responses[3]
          this.getGeneralMappings();
        });
      });
    }
  }
  