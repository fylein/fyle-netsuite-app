import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetSuiteComponent } from 'src/app/netsuite/netsuite.component';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { SubsidiaryMapping } from 'src/app/core/models/subsidiary-mapping.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdatedConfiguration } from 'src/app/core/models/updated-configuration';
import { ConfigurationDialogComponent } from './configuration-dialog/configuration-dialog.component';
import { TrackingService } from 'src/app/core/services/tracking.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../../netsuite.component.scss']
})
export class ConfigurationComponent implements OnInit {

  isLoading: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  cccExpenseOptions: { label: string, value: string }[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  showPaymentsandProjectsField: boolean;
  showAutoCreate: boolean;
  showAutoCreateMerchant: boolean;
  netsuiteSubsidiaryCountry: string;
  showImportCategories: boolean;
  cardsMapping = false;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private mappingsService: MappingsService, private netsuite: NetSuiteComponent, private trackingService: TrackingService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  getExpenseOptions(employeeMappedTo) {
    return {
      EMPLOYEE: [
        {
          label: 'Expense Report',
          value: 'EXPENSE REPORT'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL ENTRY'
        }
      ],
      VENDOR: [
        {
          label: 'Bill',
          value: 'BILL'
        },
        {
          label: 'Journal Entry',
          value: 'JOURNAL ENTRY'
        }
      ]
    }[employeeMappedTo];
  }

  getCCCExpenseOptions(reimbursableExpenseMappedTo: string) {
    const cccExpenseList = [
      {
        label: 'Bill',
        value: 'BILL'
      },
      {
        label: 'Journal Entry',
        value: 'JOURNAL ENTRY'
      },
      {
        label: 'Credit Card Charge',
        value: 'CREDIT CARD CHARGE'
      }
    ];

    if (reimbursableExpenseMappedTo === 'EXPENSE REPORT') {
      cccExpenseList.push({
        label: 'Expense Report',
        value: 'EXPENSE REPORT'
      });
    }

    return {
      BILL: cccExpenseList,
      'JOURNAL ENTRY': cccExpenseList,
      'EXPENSE REPORT': cccExpenseList
    }[reimbursableExpenseMappedTo];
  }

  setFormValues() {
    const that = this;

    that.showAutoCreateOption(that.generalSettings.auto_map_employees);
    that.expenseOptions = that.getExpenseOptions(that.generalSettings.employee_field_mapping);
    that.cccExpenseOptions = that.getCCCExpenseOptions(that.generalSettings.reimbursable_expenses_object);
    that.showPaymentsandProjectFields(that.generalSettings.reimbursable_expenses_object);
    that.showImportCategories = true;

    if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
      that.showAutoCreateMerchant = true;
    }
  }

  setupProjectsField() {
    const that = this;

    const fyleProjectMapping = that.mappingSettings.filter(
      setting => setting.source_field === 'PROJECT' && setting.destination_field !== 'PROJECT'
    );

    const netsuiteProjectMapping = that.mappingSettings.filter(
      setting => setting.destination_field === 'PROJECT' && setting.source_field !== 'PROJECT'
    );

    // disable project sync toggle if either of Fyle / NetSuite Projects are already mapped to different fields
    if (fyleProjectMapping.length || netsuiteProjectMapping.length) {
      that.generalSettingsForm.controls.importProjects.disable();
    }
  }

  setupEmployeeFieldWatcher() {
    const that = this;

    that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
      that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
      that.generalSettingsForm.controls.reimbursableExpense.reset();
      that.showImportCategories = false;
      that.generalSettingsForm.controls.cccExpense.reset();

      if (that.generalSettings) {
        that.generalSettingsForm.controls.reimbursableExpense.markAsTouched();

        if (that.generalSettings.auto_create_destination_entity && !that.showAutoCreate) {
          that.generalSettingsForm.controls.autoCreateDestinationEntity.setValue(false);
        }
      }
    });
  }

  setupReimbursableFieldWatcher() {
    const that = this;

    that.generalSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((reimbursableExpenseMappedTo) => {
      that.generalSettingsForm.controls.cccExpense.reset();
      that.cccExpenseOptions = that.getCCCExpenseOptions(reimbursableExpenseMappedTo);
      that.showPaymentsandProjectFields(reimbursableExpenseMappedTo);

      if (reimbursableExpenseMappedTo) {
        if (!that.showImportCategories) {
          that.showImportCategories = true;
        }

        if (that.generalSettings && that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' && reimbursableExpenseMappedTo !== 'EXPENSE REPORT') {
          // turn off the import categories toggle when the user switches from EXPENSE REPORT to something else
          that.generalSettingsForm.controls.importCategories.setValue(false);
        }
      }

      if (that.generalSettings && that.generalSettings.sync_fyle_to_netsuite_payments && !that.showPaymentsandProjectsField) {
        that.generalSettingsForm.controls.paymentsSync.setValue(false);
      }
    });
  }

  setupFieldWatchers() {
    const that = this;

    if (that.generalSettings) {
      that.setFormValues();
    }

    // Auto Create Destination Entity
    that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
      that.showAutoCreateOption(employeeMappingPreference);
    });

    // Employee field Mapping
    that.setupEmployeeFieldWatcher();

    // Reimbursable Expense Mapping
    that.setupReimbursableFieldWatcher();

    // Auto Create Merchant
    that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((cccExpenseMappedTo) => {
      if (cccExpenseMappedTo === 'CREDIT CARD CHARGE') {
        that.showAutoCreateMerchant = true;
      }
    });

    that.setupProjectsField();

    if (that.netsuiteSubsidiaryCountry === '_unitedStates') {
      that.generalSettingsForm.controls.importTaxDetails.disable();
    }
  }

  getAllSettings() {
    const that = this;

    forkJoin(
      [
        that.settingsService.getGeneralSettings(),
        that.settingsService.getMappingSettings()
      ]
    ).subscribe(responses => {
      that.generalSettings = responses[0];
      that.mappingSettings = responses[1].results;

      const projectFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'PROJECT' && setting.destination_field === 'PROJECT')
      );

      let importProjects = false;
      if (projectFieldMapping.length) {
        importProjects = projectFieldMapping[0].import_to_fyle;
      }

      let paymentsSyncOption = '';
      if (that.generalSettings.sync_fyle_to_netsuite_payments) {
        paymentsSyncOption = 'sync_fyle_to_netsuite_payments';
      } else if (that.generalSettings.sync_netsuite_to_fyle_payments) {
        paymentsSyncOption = 'sync_netsuite_to_fyle_payments';
      }

      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : '', Validators.required],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [that.generalSettings ? that.generalSettings.employee_field_mapping : '', Validators.required],
        importProjects: [importProjects],
        changeAccountingPeriod: [that.generalSettings.change_accounting_period],
        importCategories: [that.generalSettings.import_categories],
        importTaxDetails: [that.generalSettings.import_tax_items],
        paymentsSync: [paymentsSyncOption],
        autoMapEmployees: [that.generalSettings.auto_map_employees],
        autoCreateDestinationEntity: [that.generalSettings.auto_create_destination_entity],
        autoCreateMerchant: [that.generalSettings.auto_create_merchants],
        importVendorsAsMerchants: [that.generalSettings.import_vendors_as_merchants]
      });

      that.setupFieldWatchers();
      that.isLoading = false;
    }, () => {
      that.mappingSettings = [];
      that.generalSettingsForm = that.formBuilder.group({
        employees: ['', Validators.required],
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null],
        importProjects: [false],
        importCategories: [false],
        importTaxDetails: [false],
        changeAccountingPeriod: [false],
        paymentsSync: [null],
        autoMapEmployees: [null],
        autoCreateDestinationEntity: [false],
        autoCreateMerchant: [false],
        importVendorsAsMerchants: [false],
      });

      that.setupFieldWatchers();
      that.isLoading = false;

    });
  }

  openDialog(updatedConfigurations: UpdatedConfiguration, generalSettingsPayload: GeneralSetting, mappingSettingsPayload: MappingSetting[]) {
    const that = this;
    const dialogRef = that.dialog.open(ConfigurationDialogComponent, {
      width: '750px',
      data: updatedConfigurations
    });
    const trackingProperties = {
      oldConfigurations: that.generalSettings,
      newConfigurations: generalSettingsPayload,
      acceptedChanges: false
    };

    dialogRef.afterClosed().subscribe(data => {
      if (data.accpetedChanges) {
        that.postConfigurationsAndMappingSettings(generalSettingsPayload, mappingSettingsPayload, true, data.redirectToEmployeeMappings);
        trackingProperties.acceptedChanges = true;
      }
      that.trackingService.onUpdateConfiguration(trackingProperties);
    });
  }

  constructUpdatedConfigurationsPayload(generalSettingsPayload: GeneralSetting): UpdatedConfiguration {
    const that = this;
    const updatedConfiguration: UpdatedConfiguration = {
      autoCreateDestinationEntity: generalSettingsPayload.auto_create_destination_entity
    };

    if (that.generalSettings.employee_field_mapping !== generalSettingsPayload.employee_field_mapping) {
      updatedConfiguration.employee = {
        oldValue: that.generalSettings.employee_field_mapping,
        newValue: generalSettingsPayload.employee_field_mapping
      };
    }

    if (that.generalSettings.reimbursable_expenses_object !== generalSettingsPayload.reimbursable_expenses_object) {
      updatedConfiguration.reimburseExpense = {
        oldValue: that.generalSettings.reimbursable_expenses_object,
        newValue: generalSettingsPayload.reimbursable_expenses_object
      };
    }

    if (that.generalSettings.corporate_credit_card_expenses_object !== generalSettingsPayload.corporate_credit_card_expenses_object) {
      updatedConfiguration.cccExpense = {
        oldValue: that.generalSettings.corporate_credit_card_expenses_object,
        newValue: generalSettingsPayload.corporate_credit_card_expenses_object
      };
    }

    return updatedConfiguration;
  }

  postConfigurationsAndMappingSettings(generalSettingsPayload: GeneralSetting, mappingSettingsPayload: MappingSetting[], redirectToGeneralMappings: boolean = false, redirectToEmployeeMappings: boolean = false) {
    const that = this;
    that.isLoading = true;

    that.settingsService.postGeneralSettings(that.workspaceId, generalSettingsPayload).subscribe(() => {
      if (mappingSettingsPayload.length) {
        that.settingsService.postMappingSettings(that.workspaceId, mappingSettingsPayload).subscribe(() => {
          that.isLoading = false;
          that.snackBar.open('Configuration saved successfully');
          that.netsuite.getGeneralSettings();
        });
      } else {
          that.isLoading = false;
          that.snackBar.open('Configuration saved successfully');
          that.netsuite.getGeneralSettings();
      }

      if (redirectToGeneralMappings) {
        if (redirectToEmployeeMappings) {
          // add redirect_to_employee_mappings query param
          that.router.navigate([`workspaces/${that.workspaceId}/settings/general/mappings`], {
            queryParams: {
              redirect_to_employee_mappings: redirectToEmployeeMappings
            }
          });
        } else {
          that.router.navigateByUrl(`workspaces/${that.workspaceId}/settings/general/mappings`);
        }
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    }, () => {
      that.isLoading = false;
      that.snackBar.open('Saving configurations failed');
    });
  }

  constructConfigurationsPayload(): GeneralSetting {
    const that = this;

    let fyleToNetSuite = false;
    let netSuiteToFyle = false;

    if (that.generalSettingsForm.controls.paymentsSync.value) {
      fyleToNetSuite = that.generalSettingsForm.value.paymentsSync === 'sync_fyle_to_netsuite_payments' ? true : false;
      netSuiteToFyle = that.generalSettingsForm.value.paymentsSync === 'sync_netsuite_to_fyle_payments' ? true : false;
    }


    if (that.generalSettingsForm.value.cccExpense && that.generalSettingsForm.value.cccExpense !== 'BILL') {
      that.cardsMapping = true;
    }

    return {
      employee_field_mapping: that.generalSettingsForm.value.employees,
      reimbursable_expenses_object: that.generalSettingsForm.value.reimbursableExpense,
      corporate_credit_card_expenses_object: that.generalSettingsForm.value.cccExpense ? that.generalSettingsForm.value.cccExpense : null,
      sync_fyle_to_netsuite_payments: fyleToNetSuite,
      sync_netsuite_to_fyle_payments: netSuiteToFyle,
      import_projects: false,
      change_accounting_period: that.generalSettingsForm.value.changeAccountingPeriod ? that.generalSettingsForm.value.changeAccountingPeriod : false,
      import_categories: that.generalSettingsForm.value.importCategories,
      import_tax_items: that.generalSettingsForm.value.importTaxDetails ? that.generalSettingsForm.value.importTaxDetails : false,
      auto_map_employees: that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null,
      auto_create_destination_entity: that.generalSettingsForm.value.autoCreateDestinationEntity,
      auto_create_merchants: that.generalSettingsForm.value.autoCreateMerchant,
      map_fyle_cards_netsuite_account: that.cardsMapping,
      workspace: that.workspaceId,
      import_vendors_as_merchants: that.generalSettingsForm.value.importVendorsAsMerchants ? that.generalSettingsForm.value.importVendorsAsMerchants : false,
    };
  }

  constructMappingSettingsPayload(): MappingSetting[] {
    const that = this;

    const mappingSettingsPayload: MappingSetting[] = [];
    const importProjects = that.generalSettingsForm.value.importProjects ? that.generalSettingsForm.value.importProjects : false;
    const importTaxDetails = that.generalSettingsForm.value.importTaxDetails ? that.generalSettingsForm.value.importTaxDetails : false;

    if (importProjects) {
      mappingSettingsPayload.push({
        source_field: 'PROJECT',
        destination_field: 'PROJECT',
        import_to_fyle: true
      });
    } else {
      const projectFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'PROJECT' && setting.destination_field === 'PROJECT')
      );

      if (projectFieldMapping.length) {
        mappingSettingsPayload.push({
          source_field: 'PROJECT',
          destination_field: 'PROJECT',
          import_to_fyle: false
        });
      }
    }

    if (importTaxDetails) {
      mappingSettingsPayload.push({
        source_field: 'TAX_GROUP',
        destination_field: 'TAX_ITEM',
      });
    }

    if (that.cardsMapping) {
      mappingSettingsPayload.push({
        source_field: 'CORPORATE_CARD',
        destination_field: 'CREDIT_CARD_ACCOUNT'
      });
    }

    return mappingSettingsPayload;
  }

  save() {
    const that = this;

    const generalSettingsPayload: GeneralSetting = that.constructConfigurationsPayload();
    const mappingSettingsPayload: MappingSetting[] = that.constructMappingSettingsPayload();

    // Open dialog conditionally
    if (that.generalSettings && (that.generalSettings.employee_field_mapping !== generalSettingsPayload.employee_field_mapping || that.generalSettings.reimbursable_expenses_object !== generalSettingsPayload.reimbursable_expenses_object || that.generalSettings.corporate_credit_card_expenses_object !== generalSettingsPayload.corporate_credit_card_expenses_object)) {
      const updatedConfigurations = that.constructUpdatedConfigurationsPayload(generalSettingsPayload);
      that.openDialog(updatedConfigurations, generalSettingsPayload, mappingSettingsPayload);
    } else {
      that.postConfigurationsAndMappingSettings(generalSettingsPayload, mappingSettingsPayload);
    }
  }

  showPaymentsandProjectFields(reimbursableExpensesObject) {
    const that = this;
    if (reimbursableExpensesObject && reimbursableExpensesObject !== 'JOURNAL ENTRY') {
      that.showPaymentsandProjectsField = true;
    } else {
      that.showPaymentsandProjectsField = false;
    }
  }

  showAutoCreateOption(autoMapEmployees) {
    const that = this;
    if (autoMapEmployees && autoMapEmployees !== 'EMPLOYEE_CODE') {
      that.showAutoCreate = true;
    } else {
      that.showAutoCreate = false;
      that.generalSettingsForm.controls.autoCreateDestinationEntity.setValue(false);
    }
  }

  getSubsdiaryCountryName() {
    const that = this;
    return that.mappingsService.getSubsidiaryMappings().toPromise().then((response) => {
      if (response.country_name) {
        return response.country_name;
      } else {
        return that.mappingsService.postCountryDetails().toPromise().then((subsdiary: SubsidiaryMapping) => {
          return subsdiary.country_name;
        }).catch(() => {
          return '';
        });
      }
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;

    that.getSubsdiaryCountryName().then((res) => {
      that.netsuiteSubsidiaryCountry = res;
      that.getAllSettings();
    });
  }

}
