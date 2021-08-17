import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetSuiteComponent } from 'src/app/netsuite/netsuite.component';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../../netsuite.component.scss']
})
export class ConfigurationComponent implements OnInit {

  isLoading: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  cccExpenseOptions: { label: string, value: string}[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  showPaymentsandProjectsField: boolean;
  showAutoCreate: boolean;
  showAutoCreateMerchant: boolean;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private netsuite: NetSuiteComponent, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

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

      that.showPaymentsandProjectFields(that.generalSettings.reimbursable_expenses_object);
      that.expenseOptions = that.getExpenseOptions(that.generalSettings.employee_field_mapping);

      let paymentsSyncOption = '';
      if (that.generalSettings.sync_fyle_to_netsuite_payments) {
        paymentsSyncOption = 'sync_fyle_to_netsuite_payments';
      } else if (that.generalSettings.sync_netsuite_to_fyle_payments) {
        paymentsSyncOption = 'sync_netsuite_to_fyle_payments';
      }

      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [that.generalSettings ? that.generalSettings.employee_field_mapping : ''],
        importProjects: [importProjects],
        importCategories: [that.generalSettings.import_categories],
        paymentsSync: [paymentsSyncOption],
        autoMapEmployees: [that.generalSettings.auto_map_employees],
        autoCreateDestinationEntity: [that.generalSettings.auto_create_destination_entity],
        autoCreateMerchant: [that.generalSettings.auto_create_merchants]
      }, {
      });

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

      that.expenseOptions = [{
        label: 'Bill',
        value: 'BILL'
      },
      {
        label: 'Expense Report',
        value: 'EXPENSE REPORT'
      },
      {
        label: 'Journal Entry',
        value: 'JOURNAL ENTRY'
      }
      ];

      that.cccExpenseOptions = that.getCCCExpenseOptions(that.generalSettings.reimbursable_expenses_object);

      that.showAutoCreateOption(that.generalSettings.auto_map_employees);

      that.generalSettingsForm.controls.employees.disable();
      that.generalSettingsForm.controls.reimbursableExpense.disable();

      that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
        that.showAutoCreateOption(employeeMappingPreference);
      });

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
        if (that.generalSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
          that.showAutoCreateMerchant = true;
        }
      }

      that.isLoading = false;
    }, () => {
      that.mappingSettings = [];
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        employees: ['', Validators.required],
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null],
        importProjects: [false],
        importCategories: [false],
        paymentsSync: [null],
        autoMapEmployees: [null],
        autoCreateDestinationEntity: [false],
        autoCreateMerchant: [false]
      }, {
      });

      that.generalSettingsForm.controls.autoMapEmployees.valueChanges.subscribe((employeeMappingPreference) => {
        that.showAutoCreateOption(employeeMappingPreference);
      });

      that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
        that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
        that.generalSettingsForm.controls.reimbursableExpense.reset();
      });

      that.generalSettingsForm.controls.cccExpense.valueChanges.subscribe((cccExpenseMappedTo) => {
        if (cccExpenseMappedTo === 'CREDIT CARD CHARGE') {
          that.showAutoCreateMerchant = true;
        }
      });

      that.generalSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((reimbursableExpenseMappedTo) => {
        that.cccExpenseOptions = that.getCCCExpenseOptions(reimbursableExpenseMappedTo);
        that.showPaymentsandProjectFields(reimbursableExpenseMappedTo);
      });
    });
  }

  save() {
    const that = this;

    const mappingsSettingsPayload: MappingSetting[] = [{
      destination_field: 'ACCOUNT',
      source_field: 'CATEGORY'
    },
    {
      destination_field: 'CCC_ACCOUNT',
      source_field: 'CATEGORY'
    },
    {
      destination_field: 'EXPENSE_CATEGORY',
      source_field: 'CATEGORY'
    },
    {
      destination_field: 'CCC_EXPENSE_CATEGORY',
      source_field: 'CATEGORY'
    }
  ];

    const reimbursableExpensesObject = that.generalSettingsForm.getRawValue().reimbursableExpense;
    const cccExpensesObject = that.generalSettingsForm.getRawValue().cccExpense;
    const employeeMappingsObject = that.generalSettingsForm.getRawValue().employees;
    const importProjects = that.generalSettingsForm.value.importProjects ? that.generalSettingsForm.value.importProjects : false;
    const importCategories = that.generalSettingsForm.value.importCategories;
    const autoMapEmployees = that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null;
    const autoCreateDestinationEntity = that.generalSettingsForm.value.autoCreateDestinationEntity;

    let fyleToNetSuite = false;
    let netSuiteToFyle = false;

    if (that.generalSettingsForm.controls.paymentsSync.value) {
      fyleToNetSuite = that.generalSettingsForm.value.paymentsSync === 'sync_fyle_to_netsuite_payments' ? true : false;
      netSuiteToFyle = that.generalSettingsForm.value.paymentsSync === 'sync_netsuite_to_fyle_payments' ? true : false;
    }

    if (importProjects) {
      mappingsSettingsPayload.push({
        source_field: 'PROJECT',
        destination_field: 'PROJECT',
        import_to_fyle: true
      });
    } else {
      const projectFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'PROJECT' && setting.destination_field === 'PROJECT')
      );

      if (projectFieldMapping.length) {
        mappingsSettingsPayload.push({
          source_field: 'PROJECT',
          destination_field: 'PROJECT',
          import_to_fyle: false
        });
      }
    }

    that.isLoading = true;

    const generalSettingsPayload: GeneralSetting = {
      employee_field_mapping: employeeMappingsObject,
      reimbursable_expenses_object: reimbursableExpensesObject,
      corporate_credit_card_expenses_object: cccExpensesObject,
      sync_fyle_to_netsuite_payments: fyleToNetSuite,
      sync_netsuite_to_fyle_payments: netSuiteToFyle,
      import_projects: false,
      import_categories: importCategories,
      auto_map_employees: autoMapEmployees,
      auto_create_destination_entity: autoCreateDestinationEntity,
      auto_create_merchants: that.generalSettingsForm.value.autoCreateMerchant,
      workspace: that.workspaceId
    };

    forkJoin(
      [
        that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
        that.settingsService.postGeneralSettings(that.workspaceId, generalSettingsPayload)
      ]
    ).subscribe(() => {
      that.isLoading = false;
      that.snackBar.open('Configuration saved successfully');
      that.netsuite.getGeneralSettings();
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
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

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;

    that.getAllSettings();
  }

}
