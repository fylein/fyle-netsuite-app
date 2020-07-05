import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

const FYLE_URL = environment.fyle_url;
const FYLE_CLIENT_ID = environment.fyle_client_id;
const APP_URL = environment.app_url;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../base.component.css'],
})
export class SettingsComponent implements OnInit {
  showModal = false;
  fyleConnected: boolean;
  netsuiteConnected: boolean;
  invalidLogin: boolean;
  isLoading = true;
  state: string = 'source';
  source: string = 'active';
  destination: string;
  settings: string;
  subsidiary: string;
  workspaceId: number;
  form: FormGroup;
  error: string;
  nsAccountIdIsValid: boolean = true;
  nsConsumerKeyIsValid: boolean = true;
  nsConsumerSecretIsValid: boolean = true;
  nsTokenIdIsValid: boolean = true;
  nsTokenSecretIsValid: boolean = true;
  modalRef: NgbModalRef;
  closeResult: string;
  generalSettingsForm: FormGroup;
  mappingSettings: any;
  projectFieldMapping: any = {};
  costCenterFieldMapping: any = {};
  employeeFieldMapping: any = {};
  employeeFieldOptions: any[];
  projectFieldOptions: any[];
  costCenterFieldOptions: any[];
  netsuiteSubsidiaries: any[];
  subsidiaryMappings: any;
  subsidiaryForm: FormGroup;
  subsidiaryIsValid: boolean = true;

  constructor(private modalService: NgbModal, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      nsAccountId: new FormControl(''),
      nsConsumerKey: new FormControl(''),
      nsConsumerSecret: new FormControl(),
      nsTokenId: new FormControl(),
      nsTokenSecret: new FormControl(),
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'generalSettingsModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getSource() {
    this.settingsService.getFyleCredentials(this.workspaceId).subscribe(credentials => {
      if (credentials) {
        this.fyleConnected = true;
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 400) {
        this.fyleConnected = false;
        this.isLoading = false;
      }
    });
  }


  getDestination() {
    this.settingsService.getNetSuiteCredentials(this.workspaceId).subscribe(settings => {
      if (settings) {
        this.netsuiteConnected = true;
        this.isLoading = false;
      }
    }, error => {
      if (error.status == 400) {
        this.netsuiteConnected = false;
        this.isLoading = false;
      }
    });
  }

  disconnectFyle() {
    this.settingsService.deleteFyleCredentials(this.workspaceId).subscribe(response => {
      this.fyleConnected = false;
    });
  }


  toggleState(state: string) {
    this.state = state;
    this.error = '';

    if (this.state === 'source') {
      this.source = 'active';
      this.destination = '';
      this.settings = '';
      this.subsidiary= '';
    } else if (this.state === 'destination') {
      this.source = '';
      this.destination = 'active';
      this.settings = '';
      this.subsidiary= '';
    } else if (this.state === 'subsidiary') {
      this.source = '';
      this.destination = '';
      this.settings = '';
      this.subsidiary= 'active';
    } else if (this.state === 'settings') {
      this.source = '';
      this.destination = '';
      this.subsidiary= '';
      this.settings = 'active';
    }
  }


  submit() {
    this.nsAccountIdIsValid = false;
    this.nsConsumerKeyIsValid = false;
    this.nsConsumerSecretIsValid = false;
    this.nsTokenIdIsValid = false;
    this.nsTokenSecretIsValid = false;

    let accountId = this.form.value.nsAccountId;
    let consumerKey = this.form.value.nsConsumerKey;
    let consumerSecret = this.form.value.nsConsumerSecret;
    let tokenId = this.form.value.nsTokenId;
    let tokenSecret = this.form.value.nsTokenSecret;

    if (accountId) {
      this.nsAccountIdIsValid = true;
    }

    if (consumerKey) {
      this.nsConsumerKeyIsValid = true;
    }

    if (consumerSecret) {
      this.nsConsumerSecretIsValid = true;
    }

    if (tokenId) {
      this.nsTokenIdIsValid = true;
    }

    if (tokenSecret) {
      this.nsTokenSecretIsValid = true;
    }

    if (this.nsAccountIdIsValid && this.nsConsumerKeyIsValid && this.nsConsumerSecretIsValid && this.nsTokenIdIsValid && this.nsTokenSecretIsValid) {
      this.isLoading = true;
      this.netsuiteConnected = false;
      this.settingsService.connectNetSuite(this.workspaceId, accountId, consumerKey, consumerSecret, tokenId, tokenSecret).subscribe(credentials => {
        if (credentials) {
          this.settingsService.postNetSuiteSubsidiaries(this.workspaceId).subscribe(response => {
            this.netsuiteSubsidiaries = response
          });
          this.netsuiteConnected = true;
          this.isLoading = false;
        }
      }, error => {
        if (error.status == 400) {
          this.isLoading = false;
          this.invalidLogin = true;
          this.netsuiteConnected = false
      }
    });
    }
  }

  getAllSettings() {
    forkJoin(
      [
        this.settingsService.getMappingSettings(this.workspaceId)
      ]
    ).subscribe(responses => {
      this.mappingSettings = responses[0]['results'];

      let employeeFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'EMPLOYEE'
      )[0];

      let projectFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      let costCenterFieldMapping = this.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      this.employeeFieldMapping = employeeFieldMapping? employeeFieldMapping: {};
      this.projectFieldMapping = projectFieldMapping? projectFieldMapping: {};
      this.costCenterFieldMapping = costCenterFieldMapping? costCenterFieldMapping: {};
      
      this.generalSettingsForm = this.formBuilder.group({
        employeeFieldOptions: [this.employeeFieldMapping? this.employeeFieldMapping.destination_field: ''],
        projectFieldOptions: [this.projectFieldMapping? this.projectFieldMapping.destination_field: ''],
        costCenterFieldOptions: [this.costCenterFieldMapping? this.costCenterFieldMapping.destination_field: '']
      });

      if (employeeFieldMapping) {
        this.generalSettingsForm.controls.employeeFieldOptions.disable();
      }
      
      if (projectFieldMapping) {
        this.generalSettingsForm.controls.projectFieldOptions.disable();
      }

      if (costCenterFieldMapping) {
        this.generalSettingsForm.controls.costCenterFieldOptions.disable();
      }

      this.initializeForm();

      this.isLoading = false;
    }, error => {
      if (error.status == 400) {
        this.mappingSettings = {}
        this.isLoading = false;
        this.generalSettingsForm = this.formBuilder.group({
          employeeFieldOptions: [''],
          projectFieldOptions: [''],
          costCenterFieldOptions: ['']
        });
        this.initializeForm();
      }
    }); 
  }

  initializeForm() {
    this.generalSettingsForm.controls['projectFieldOptions'].valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.costCenterFieldOptions = [
          { name: 'DEPARTMENT' },
          { name: 'CLASS' },
        ];
        
        if (value) {
          this.costCenterFieldOptions = this.costCenterFieldOptions.filter(option => option.name !== value);
        }
      }, 500);
    });

    this.generalSettingsForm.controls['costCenterFieldOptions'].valueChanges.subscribe((value) => {
      this.projectFieldOptions = [
        { name: 'CLASS' },
        { name: 'DEPARTMENT' },
      ];

      setTimeout(() => {
        if (value) {
          this.projectFieldOptions = this.projectFieldOptions.filter(option => option.name !== value);
        }
      }, 500);
    });
}

  submitSettings() {

    let mappingsSettingsPayload = [{
      source_field: 'CATEGORY',
      destination_field: 'ACCOUNT'
    }]

    let employeeMappingObject = this.generalSettingsForm.value.employeeFieldOptions? this.generalSettingsForm.value.employeeFieldOptions: this.employeeFieldMapping.destination_field;
    let costCenterMappingObject = this.generalSettingsForm.value.costCenterFieldOptions? this.generalSettingsForm.value.costCenterFieldOptions: this.costCenterFieldMapping.destination_field;
    let projectMappingObject = this.generalSettingsForm.value.projectFieldOptions? this.generalSettingsForm.value.projectFieldOptions: this.projectFieldMapping.destination_field;

    if (employeeMappingObject) {
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: employeeMappingObject
      });
    }

    if (projectMappingObject != null) {
      mappingsSettingsPayload.push({
        source_field: 'PROJECT',
        destination_field: projectMappingObject
      });
    }

    if (costCenterMappingObject != null) {
      mappingsSettingsPayload.push({
        source_field: 'COST_CENTER',
        destination_field: costCenterMappingObject
      });
    }
      this.isLoading = true;
      forkJoin(
        [
          this.settingsService.postMappingSettings(this.workspaceId, mappingsSettingsPayload),
        ]
      ).subscribe(responses => {
        this.closeModal();
        this.isLoading = true;
        window.location.href= `/workspaces/${this.workspaceId}/expense_groups`;
      });
  }

  closeModal() {
    this.modalRef.close();
  }

  connectFyle() {
    window.location.href =
      `${FYLE_URL}/app/developers/#/oauth/authorize?client_id=${FYLE_CLIENT_ID}&redirect_uri=${APP_URL}/workspaces/fyle/callback&response_type=code&state=${this.workspaceId}`;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  submitSubsidiary() {
    this.subsidiaryIsValid = false;

    let subsidiaryId = this.subsidiaryForm.value.netsuiteSubsidiaries;
    let netsuiteSubsidiary = this.netsuiteSubsidiaries.filter(filteredSubsidiary => filteredSubsidiary.destination_id === subsidiaryId)[0];

    if (subsidiaryId != null) {
      this.subsidiaryIsValid = true;
    }


    if(this.subsidiaryIsValid){
      this.settingsService.postSubsidiaryMappings(this.workspaceId, netsuiteSubsidiary.destination_id, netsuiteSubsidiary.value,).subscribe(response => {
        this.closeModal();
        window.location.href= `/workspaces/${this.workspaceId}/expense_groups`;
      });
    }
  }

  getSubsidiaryMappings() {
    this.settingsService.getSubsidiaryMappings(this.workspaceId).subscribe(subsidiaryMappings => {
      this.subsidiaryMappings = subsidiaryMappings;
      this.isLoading = false;
      this.subsidiaryForm = this.formBuilder.group({
        netsuiteSubsidiaries: [this.subsidiaryMappings? this.subsidiaryMappings.internal_id: ''],
      });
      if (subsidiaryMappings) {
        this.subsidiaryForm.disable();
      }
    }, error => {
      if(error.status == 400) {
        this.subsidiaryMappings = {};
        this.isLoading = false;
        this.subsidiaryForm = this.formBuilder.group({
          netsuiteSubsidiaries: [this.subsidiaryMappings? this.subsidiaryMappings.internal_id: '']
        });
      }
    });
  }

  ngOnInit() {
    this.employeeFieldOptions = [
      { name: 'VENDOR' }
    ];

    this.projectFieldOptions = [
      { name: 'DEPARTMENT' },
      { name: 'CLASS' },
    ];

    this.costCenterFieldOptions = [
      { name: 'CLASS' },
      { name: 'DEPARTMENT' },
    ];

    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.route.queryParams.subscribe(queryParams => {
        this.getSource();
        this.getDestination();
        this.getSubsidiaryMappings();
        if (queryParams.state) {
          this.toggleState(queryParams.state);
          this.error = queryParams.error;
        } else {
          this.toggleState('source');
          this.error = queryParams.error;
        }
      });
      this.getAllSettings();
    });
    this.settingsService.getNetSuiteSubsidiaries(this.workspaceId).subscribe(response => {
      this.netsuiteSubsidiaries = response
      this.isLoading = false;
    });
  }
}
