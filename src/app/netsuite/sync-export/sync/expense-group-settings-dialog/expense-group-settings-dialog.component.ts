import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { SettingsService } from 'src/app/core/services/settings.service';
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

  constructor(private formBuilder: FormBuilder, private expenseGroupsService: ExpenseGroupsService, private settingsService: SettingsService, private dialogRef: MatDialogRef<ExpenseGroupSettingsDialogComponent>) { }

save() {
  const that = this;

  that.isLoading = true;

  const reimbursibleExpensesGroupedBy = [that.importExpensesForm.value.reimbursibleExpenseGroupConfiguration];
  const cccExpensesGroupedBy = [that.importExpensesForm.value.cccExpenseGroupConfiguration];
  const expenseState = that.importExpensesForm.value.expenseState;
  const reimbursableExportDateType = that.importExpensesForm.value.reimbursableExportDate;
  const cccExportDateType = that.importExpensesForm.value.cccExportDate;

  this.expenseGroupsService.createExpenseGroupsSettings(reimbursibleExpensesGroupedBy, cccExpensesGroupedBy, expenseState, reimbursableExportDateType, cccExportDateType).subscribe(response => {
    that.dialogRef.close();
  });
}

getExpenseGroupSettings() {
  const that = this;
  that.expenseGroupsService.getExpenseGroupSettings().subscribe(response => {
    that.expenseGroupSettings = response;

    const reimbursableFields = that.expenseGroupSettings.reimbursable_expense_group_fields;
    let reimbursibleConfiguration = null;

    if (reimbursableFields.includes('claim_number')) {
      reimbursibleConfiguration = 'claim_number';
    } else if (reimbursableFields.includes('settlement_id')) {
      reimbursibleConfiguration = 'settlement_id';
    } else if (reimbursableFields.includes('expense_id')) {
      reimbursibleConfiguration = 'expense_id';
    }

    const cccFields = that.expenseGroupSettings.corporate_credit_card_expense_group_fields;
    let cccConfiguration = null;

    if (cccFields.includes('claim_number')) {
      cccConfiguration = 'claim_number';
    } else if (cccFields.includes('settlement_id')) {
      cccConfiguration = 'settlement_id';
    } else if (cccFields.includes('expense_id')) {
      cccConfiguration = 'expense_id';
    }

    that.isLoading = false;
    that.importExpensesForm = that.formBuilder.group({
      reimbursibleExpenseGroupConfiguration: [ reimbursibleConfiguration ],
      cccExpenseGroupConfiguration: [ cccConfiguration ],
      expenseState: [ that.expenseGroupSettings.expense_state, [ Validators.required ]],
      reimbursableExportDate: [ that.expenseGroupSettings.reimbursable_export_date_type],
      cccExportDate: [ that.expenseGroupSettings.ccc_export_date_type]
    });

    that.isLoading = false;
  });
}

showCCCGroups() {
  const that = this;

  that.settingsService.getGeneralSettings().subscribe(response => {
    that.workspaceGeneralSettings = response;
  });

  if (that.workspaceGeneralSettings.corporate_credit_card_expenses_object) {
    return true;
  } else {
    return false;
  }
}

ngOnInit() {
  const that = this;

  that.isLoading = true;

  that.getExpenseGroupSettings();

}

}
