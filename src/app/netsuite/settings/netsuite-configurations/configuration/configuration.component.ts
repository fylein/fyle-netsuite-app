import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  workspaceId: number;
  generalSettings: any;
  mappingSettings: any;
  employeeFieldMapping: any;
  projectFieldMapping: any;
  costCenterFieldMapping: any;

  constructor(private formBuilder: FormBuilder, private settingsService: SettingsService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

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

  configurationProjectCostCenterValidator: ValidatorFn = (fg: FormGroup) => {
    const project = fg.get('projects').value;
    const costCenter = fg.get('costCenters').value;
    if (!project || !costCenter) {
      return null;
    }

    return project === costCenter ? { projectCostCenterSame: true } : null;
  }

  vendorConfigurationValidator: ValidatorFn = (fg: FormGroup) => {
    const emp = fg.get('employees').value;
    const cccObject = fg.get('cccExpense').value;
    if (!emp || !cccObject) {
      return null;
    }

    return emp === 'VENDOR' && cccObject === 'EXPENSE REPORT' ? { billCheck: true } : null;
  }

  employeeConfigurationValidator: ValidatorFn = (fg: FormGroup) => {
    const emp = fg.get('employees').value;
    const cccObject = fg.get('cccExpense').value;
    if (!emp || !cccObject) {
      return null;
    }

    return emp === 'EMPLOYEE' && cccObject === 'BILL' ? { exprptCheck: true } : null;
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

      const projectFieldMapping = that.mappingSettings.filter(
        settings => settings.source_field === 'PROJECT'
      )[0];

      const costCenterFieldMapping = that.mappingSettings.filter(
        settings => settings.source_field === 'COST_CENTER'
      )[0];

      that.employeeFieldMapping = employeeFieldMapping;
      that.projectFieldMapping = projectFieldMapping ? projectFieldMapping : {};
      that.costCenterFieldMapping = costCenterFieldMapping ? costCenterFieldMapping : {};

      that.expenseOptions = that.getExpenseOptions(that.employeeFieldMapping.destination_field);

      that.generalSettingsForm = that.formBuilder.group({
        reimbursableExpense: [that.generalSettings ? that.generalSettings.reimbursable_expenses_object : ''],
        cccExpense: [that.generalSettings ? that.generalSettings.corporate_credit_card_expenses_object : ''],
        employees: [that.employeeFieldMapping ? that.employeeFieldMapping.destination_field : ''],
        projects: [that.projectFieldMapping ? that.projectFieldMapping.destination_field : ''],
        costCenters: [that.costCenterFieldMapping ? that.costCenterFieldMapping.destination_field : ''],
      }, {
        validators: [that.configurationProjectCostCenterValidator, that.vendorConfigurationValidator]
      });

      if (that.generalSettings.reimbursable_expenses_object) {
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
      }

      that.generalSettingsForm.controls.employees.disable();
      that.generalSettingsForm.controls.reimbursableExpense.disable();

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        that.generalSettingsForm.controls.cccExpense.disable();
      }

      if (projectFieldMapping) {
        that.generalSettingsForm.controls.projects.disable();
      }

      if (costCenterFieldMapping) {
        that.generalSettingsForm.controls.costCenters.disable();
      }

      if (that.generalSettings.corporate_credit_card_expenses_object && projectFieldMapping && costCenterFieldMapping) {
        that.isSaveDisabled = true;
      }

      that.isLoading = false;
    }, error => {
      that.generalSettings = {};
      that.mappingSettings = {};
      that.isLoading = false;
      that.generalSettingsForm = that.formBuilder.group({
        employees: ['', Validators.required],
        reimbursableExpense: ['', Validators.required],
        cccExpense: [null],
        projects: [null],
        costCenters: [null],
      }, {
        validators: [that.configurationProjectCostCenterValidator]
      });

      that.generalSettingsForm.controls.employees.valueChanges.subscribe((employeeMappedTo) => {
        that.expenseOptions = that.getExpenseOptions(employeeMappedTo);
        that.generalSettingsForm.controls.reimbursableExpense.reset();
      });
    });
  }

  save() {
    const that = this;
    if (that.generalSettingsForm.valid) {
      const mappingsSettingsPayload = [{
        source_field: 'CATEGORY',
        destination_field: 'ACCOUNT'
      }];

      const reimbursableExpensesObject = that.generalSettingsForm.value.reimbursableExpense || that.generalSettings.reimbursable_expenses_object;
      const cccExpensesObject = that.generalSettingsForm.value.cccExpense || that.generalSettings.corporate_credit_card_expenses_object;
      const employeeMappingsObject = that.generalSettingsForm.value.employees || (that.employeeFieldMapping && that.employeeFieldMapping.destination_field);
      const costCenterMappingObject = that.generalSettingsForm.value.costCenters || (that.costCenterFieldMapping && that.costCenterFieldMapping.destination_field);
      const projectMappingObject = that.generalSettingsForm.value.projects || (that.projectFieldMapping && that.projectFieldMapping.destination_field);

      if (cccExpensesObject) {
        mappingsSettingsPayload.push({
          source_field: 'EMPLOYEE',
          destination_field: 'CREDIT_CARD_ACCOUNT'
        });
      }

      if (projectMappingObject) {
        mappingsSettingsPayload.push({
          source_field: 'PROJECT',
          destination_field: projectMappingObject
        });
      }

      if (costCenterMappingObject) {
        mappingsSettingsPayload.push({
          source_field: 'COST_CENTER',
          destination_field: costCenterMappingObject
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
          that.settingsService.postGeneralSettings(that.workspaceId, reimbursableExpensesObject, cccExpensesObject)
        ]
      ).subscribe(responses => {
        that.isLoading = true;
        that.snackBar.open('Configuration saved successfully');
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.generalSettingsForm.markAllAsTouched();
    }
  }

  ngOnInit() {
    const that = this;
    that.isSaveDisabled = false;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.getAllSettings();
  }

}