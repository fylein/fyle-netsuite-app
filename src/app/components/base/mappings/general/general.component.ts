import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  generalMappings: any;
  isLoading: boolean = true;
  locationIsValid: boolean = true;
  accountsPayableIsValid: boolean = true;

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
    
    let accountId = formValues? formValues.accountsPayableAccounts: this.form.value.accountsPayableAccounts;
    let accountsPayableAccount = this.accountsPayableAccounts.filter(filteredAccount => filteredAccount.destination_id === accountId)[0];

    if (accountId != null) {
      this.accountsPayableIsValid = true;
    }

    if(this.locationIsValid && this.accountsPayableIsValid){
      this.isLoading = true;
      this.mappingsService.postGeneralMappings(this.workspaceId, netsuiteLocation.value, netsuiteLocation.destination_id, accountsPayableAccount.value, accountsPayableAccount.destination_id).subscribe(response => {
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
        accountsPayableAccounts: [this.generalMappings? this.generalMappings.accounts_payable_id: '']
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
          accountsPayableAccounts: [this.generalMappings? this.generalMappings.accounts_payable_id: '']
        });
      }
    });
  }


    ngOnInit() {
      this.route.parent.params.subscribe(params => {
        this.workspaceId = +params['workspace_id'];
        forkJoin(
          [
            this.mappingsService.getNetSuiteLocations(this.workspaceId),
            this.mappingsService.getAccountsPayables(this.workspaceId)
          ]
        ).subscribe(responses => {
          this.netsuiteLocations = responses[0]
          this.accountsPayableAccounts = responses[1]
          this.getGeneralMappings();
        });
      });
    }
  }
  