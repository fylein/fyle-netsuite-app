import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseGroupSetting } from 'src/app/core/models/expense-group-setting.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';

@Component({
  selector: 'app-expense-group-settings-dialog',
  templateUrl: './expense-group-settings-dialog.component.html',
  styleUrls: ['./expense-group-settings-dialog.component.scss', '../../../netsuite.component.scss']
})
export class ExpenseGroupSettingsDialogComponent implements OnInit {
  importExpensesForm: FormGroup;
  expenseGroupSettings: ExpenseGroupSetting;
  workspaceGeneralSettings: GeneralSetting;
  isLoading: boolean;
  exportDateOptions: { label: string, value: string }[];
  cccExportDateOptions: { label: string, value: string }[];
  reimbursableOptions: { label: string, value: string }[];
  cccOptions: { label: string, value: string }[];
  expenseGroupingFieldOptions: { label: string, value: string }[];
  workspaceId: number;

  constructor(private formBuilder: FormBuilder, private expenseGroupsService: ExpenseGroupsService, private settingsService: SettingsService, private storageService: StorageService, private dialogRef: MatDialogRef<ExpenseGroupSettingsDialogComponent>) { }

save() {
  const that = this;

  that.isLoading = true;

  const reimbursableExpensesGroupedBy = [that.importExpensesForm.value.reimbursableExpenseGroupConfiguration];
  const cccExpensesGroupedBy = [that.importExpensesForm.getRawValue().cccExpenseGroupConfiguration];
  const expenseState = that.importExpensesForm.value.expenseState;
  const cccExpenseState = that.importExpensesForm.value.cccExpenseState;
  const reimbursableExportDateType = that.importExpensesForm.value.reimbursableExportDate;
  const cccExportDateType = that.importExpensesForm.getRawValue().cccExportDate;

  const expenseGroupSettingsPayload: ExpenseGroupSetting = {
    reimbursable_expense_group_fields: reimbursableExpensesGroupedBy,
    corporate_credit_card_expense_group_fields: cccExpensesGroupedBy,
    expense_state: expenseState,
    ccc_expense_state: cccExpenseState,
    reimbursable_export_date_type: reimbursableExportDateType,
    ccc_export_date_type: cccExportDateType
  };

  this.expenseGroupsService.createExpenseGroupsSettings(expenseGroupSettingsPayload).subscribe(response => {
    that.dialogRef.close();
  });
}

getExpenseGroupSettings() {
  const that = this;
  that.expenseGroupsService.getExpenseGroupSettings().subscribe(response => {
    that.expenseGroupSettings = response;

    const reimbursableFields = that.expenseGroupSettings.reimbursable_expense_group_fields;

    const cccFields = that.expenseGroupSettings.corporate_credit_card_expense_group_fields;

    that.isLoading = false;
    that.importExpensesForm = that.formBuilder.group({
      reimbursableExpenseGroupConfiguration: [ that.getFieldConfiguration(reimbursableFields) ],
      cccExpenseGroupConfiguration: [ that.getFieldConfiguration(cccFields) ],
      expenseState: [ that.expenseGroupSettings.expense_state, [ Validators.required ]],
      cccExpenseState: [ that.expenseGroupSettings.ccc_expense_state, [ Validators.required ]],
      reimbursableExportDate: [ that.expenseGroupSettings.reimbursable_export_date_type],
      cccExportDate: [ that.expenseGroupSettings.ccc_export_date_type]
    });

    if (that.workspaceGeneralSettings.corporate_credit_card_expenses_object === 'CREDIT CARD CHARGE') {
      that.importExpensesForm.controls.cccExpenseGroupConfiguration.disable();
      this.cccExportDateOptions = [
        {
          label: 'Spend Date',
          value: 'spent_at'
        },
        {
          label: 'Posted Date',
          value: 'posted_at'
        }
      ];
    } else {
      this.setCreditCardExpenseGroupingDateOptions(this.importExpensesForm.value.cccExpenseGroupConfiguration);
    }

    that.isLoading = false;
  });
}

getFieldConfiguration(fieldType) {
  let fieldConfiguration = null;
  if (fieldType.includes('expense_id')) {
    fieldConfiguration = 'expense_id';
  } else if (fieldType.includes('claim_number')) {
    fieldConfiguration = 'claim_number';
  } else if (fieldType.includes('settlement_id')) {
    fieldConfiguration = 'settlement_id';
  }
  return fieldConfiguration;
}

showCCCGroups() {
  const that = this;
  return that.workspaceGeneralSettings.corporate_credit_card_expenses_object;
}

setCreditCardExpenseGroupingDateOptions(value) {
  if (value === 'expense_id') {
    this.cccExportDateOptions = this.exportDateOptions.concat([{
      label: 'Posted Date',
      value: 'posted_at'
    }]);
  } else {
    this.cccExportDateOptions = this.exportDateOptions.concat();
  }
}

ngOnInit() {
  const that = this;

  that.workspaceId = that.storageService.get('workspaceId');

  that.isLoading = true;

  that.exportDateOptions = [
    {
      label: 'Current Date',
      value: 'current_date'
    },
    {
      label: 'Verification Date',
      value: 'verified_at'
    },
    {
      label: 'Spend Date',
      value: 'spent_at'
    },
    {
      label: 'Approval Date',
      value: 'approved_at'
    },
    {
      label: 'Last Spend Date',
      value: 'last_spent_at'
    }
  ];

  that.expenseGroupingFieldOptions = [
    {
      label: 'Expense Report',
      value: 'claim_number'
    },
    {
      label: 'Payment',
      value: 'settlement_id'
    },
    {
      label: 'Expense',
      value: 'expense_id'
    }
  ];

  that.settingsService.getGeneralSettings().subscribe(response => {
    that.workspaceGeneralSettings = response;
    that.getExpenseGroupSettings();
  });

  that.reimbursableOptions = [
    {
      label: that.workspaceGeneralSettings.is_simplify_report_closure_enabled ? 'Processing' : 'Payment Processing',
      value: 'PAYMENT_PROCESSING'
    },
    {
      label: that.workspaceGeneralSettings.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
      value: 'PAID'
    }
  ];

  that.cccOptions = [
    {
      label: that.workspaceGeneralSettings.is_simplify_report_closure_enabled ? 'Approved' : 'Payment Processing',
      value: that.workspaceGeneralSettings.is_simplify_report_closure_enabled ? 'APPROVED' : 'PAYMENT_PROCESSING'
    },
    {
      label: that.workspaceGeneralSettings.is_simplify_report_closure_enabled ? 'Closed' : 'Paid',
      value: 'PAID'
    }
  ];
}

}
