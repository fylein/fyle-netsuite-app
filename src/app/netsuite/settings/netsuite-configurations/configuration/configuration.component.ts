import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from 'src/app/core/services/storage.service';
import { NetSuiteComponent } from 'src/app/netsuite/netsuite.component';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { Mapping } from 'src/app/core/models/mappings.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss', '../../../netsuite.component.scss']
})
export class ConfigurationComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  generalSettingsForm: FormGroup;
  expenseOptions: { label: string, value: string }[];
  cccExpenseOptions: { label: string, value: string}[];
  workspaceId: number;
  generalSettings: GeneralSetting;
  mappingSettings: MappingSetting[];
  employeeFieldMapping: MappingSetting;
  showPaymentsandProjectsField: boolean;

  constructor(private formBuilder: FormBuilder, private storageService: StorageService,  private settingsService: SettingsService, private netsuite: NetSuiteComponent, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

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

  getCCCExpenseOptions(reimbursableExpenseMappedTo) {
    const cccExpenseList = [
      {
        label: 'Bill',
        value: 'BILL'
      },
      {
        label: 'Journal Entry',
        value: 'JOURNAL ENTRY'
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
    that.isLoading = true;
    forkJoin(
      [
        that.settingsService.getGeneralSettings(that.workspaceId),
        that.settingsService.getMappingSettings(that.workspaceId)
      ]
    ).subscribe(responses => {
      that.generalSettings = responses[0];
      that.mappingSettings = responses[1].results;

      const employeeFieldMapping = that.mappingSettings.filter(
        setting => (setting.source_field === 'EMPLOYEE') &&
          (setting.destination_field === 'EMPLOYEE' || setting.destination_field === 'VENDOR')
      )[0];

      that.employeeFieldMapping = employeeFieldMapping;

      that.showPaymentsandProjectFields(that.generalSettings.reimbursable_expenses_object);
      that.expenseOptions = that.getExpenseOptions(that.employeeFieldMapping.destination_field);

      let paymentsSyncOption = '';
      if (that.generalSettings.sync_fyle_to_netsuite_payments) {
        paymentsSyncOption = 'sync_fyle_to_netsuite_payments';
      } else if (that.generalSettings.sync_netsuite_to_fyle_payments) {
        paymentsSyncOption = 'sync_netsuite_to_fyle_payments';
      }

      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [that.employeeFieldMapping ? that.employeeFieldMapping.destination_field : ''],
        importProjects: [that.generalSettings.import_projects],
        importCategories: [that.generalSettings.import_categories],
        paymentsSync: [paymentsSyncOption],
        autoMapEmployees: [that.generalSettings.auto_map_employees]
      }, {
      });

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

      that.generalSettingsForm.controls.employees.disable();
      that.generalSettingsForm.controls.reimbursableExpense.disable();

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      that.isLoading = false;
    }, error => {
      that.mappingSettings = [];
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        employees: ['', Validators.required],
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null],
        importProjects: [false],
        importCategories: [false],
        paymentsSync: [null],
        autoMapEmployees: [null]
      }, {
      });

      that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
        that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
        that.generalSettingsForm.controls.reimbursableExpense.reset();
      });

      that.generalSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((reimbursableExpenseMappedTo) => {
        that.cccExpenseOptions = that.getCCCExpenseOptions(reimbursableExpenseMappedTo);
        that.showPaymentsandProjectFields(reimbursableExpenseMappedTo);
      });
    });
  }

  save() {
    const that = this;
    if (that.generalSettingsForm.valid) {
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

      const reimbursableExpensesObject = that.generalSettingsForm.value.reimbursableExpense || that.generalSettings.reimbursable_expenses_object;
      const cccExpensesObject = that.generalSettingsForm.value.cccExpense || that.generalSettings.corporate_credit_card_expenses_object;
      const employeeMappingsObject = that.generalSettingsForm.value.employees || (that.employeeFieldMapping && that.employeeFieldMapping.destination_field);
      const importProjects = that.generalSettingsForm.value.importProjects;
      const importCategories = that.generalSettingsForm.value.importCategories;
      const autoMapEmployees = that.generalSettingsForm.value.autoMapEmployees ? that.generalSettingsForm.value.autoMapEmployees : null;

      let fyleToNetSuite = false;
      let netSuiteToFyle = false;

      if (that.generalSettingsForm.controls.paymentsSync.value) {
        fyleToNetSuite = that.generalSettingsForm.value.paymentsSync === 'sync_fyle_to_netsuite_payments' ? true : false;
        netSuiteToFyle = that.generalSettingsForm.value.paymentsSync === 'sync_netsuite_to_fyle_payments' ? true : false;
      }

      if (cccExpensesObject) {
        const destinationField = 'CREDIT_CARD_ACCOUNT';
        const sourceField = 'EMPLOYEE';

        mappingsSettingsPayload.push({
          source_field: sourceField,
          destination_field: destinationField
        });
      }

      if (importProjects) {
        mappingsSettingsPayload.push({
          source_field: 'PROJECT',
          destination_field: 'PROJECT'
        });
      }

      that.isLoading = true;
      mappingsSettingsPayload.push({
        source_field: 'EMPLOYEE',
        destination_field: employeeMappingsObject
      });

      forkJoin(
        [
          that.settingsService.postMappingSettings(that.workspaceId, mappingsSettingsPayload),
          that.settingsService.postGeneralSettings(that.workspaceId, reimbursableExpensesObject, cccExpensesObject, fyleToNetSuite, netSuiteToFyle, importProjects, importCategories, autoMapEmployees)
        ]
      ).subscribe(() => {
        that.isLoading = false;
        that.snackBar.open('Configuration saved successfully');
        if (autoMapEmployees) {
          setTimeout(() => {
            that.snackBar.open('Auto mapping of employees may take up to 10 minutes');
          }, 1500);
        }
        that.netsuite.getGeneralSettings();
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.generalSettingsForm.markAllAsTouched();
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

  ngOnInit() {
    const that = this;
    that.isSaveDisabled = false;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.getAllSettings();
  }

}
