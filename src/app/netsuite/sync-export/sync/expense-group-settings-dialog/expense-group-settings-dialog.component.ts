import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-expense-group-settings-dialog',
  templateUrl: './expense-group-settings-dialog.component.html',
  styleUrls: ['./expense-group-settings-dialog.component.scss', '../../../netsuite.component.scss']
})
export class ExpenseGroupSettingsDialogComponent implements OnInit {
  importExpensesForm: FormGroup;
  expenseGroupSettings: any;
  isLoading: boolean;
  
  constructor(private formBuilder: FormBuilder, private expenseGroupsService: ExpenseGroupsService, private dialogRef: MatDialogRef<ExpenseGroupSettingsDialogComponent>) { }

save() {
  const that = this;

  that.isLoading = true;

  const expensesGroupedBy = that.importExpensesForm.value.expenseGroupConfiguration;
  const expenseStates = that.importExpensesForm.value.expenseStates;
  const exportDateType = that.importExpensesForm.value.exportDate;

  this.expenseGroupsService.createExpenseGroupsSettings(expensesGroupedBy, expenseStates, exportDateType).subscribe(response => {
    that.dialogRef.close();
  });
}

getExpenseGroupSettings() {
  const that = this;
  that.expenseGroupsService.getExpenseGroupSettings().subscribe(response => {
    that.expenseGroupSettings = response;
    that.isLoading = false;
    that.importExpensesForm = that.formBuilder.group({
      expenseGroupConfiguration: [ that.expenseGroupSettings.reimbursable_expense_group_fields ],
      expenseStates: [ that.expenseGroupSettings.expense_states, [ Validators.required ]],
      exportDate: [ that.expenseGroupSettings.export_date_type]
    });

    that.isLoading = false;
  });
}

ngOnInit() {
  const that = this;

  that.isLoading = true;

  that.getExpenseGroupSettings();

}

}
