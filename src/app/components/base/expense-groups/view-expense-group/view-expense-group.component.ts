import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseGroupsService } from '../expense-groups.service';
import { forkJoin } from 'rxjs';
import { TasksService } from '../../tasks/tasks.service';
import { BillsService } from '../../bills/bills.service';
import { JournalEntriesService } from '../../journal-entries/journal-entries.service';
import { ExpenseReportsService } from '../../expense-reports/expense-reports.service';

@Component({
  selector: 'app-view-expense-group',
  templateUrl: './view-expense-group.component.html',
  styleUrls: ['./view-expense-group.component.css', '../expense-groups.component.css', '../../base.component.css']
})
export class ViewExpenseGroupComponent implements OnInit {
  workspaceId: number;
  expenseGroupId: number;
  expenses: any[];
  isLoading: boolean = true;
  expenseGroup: any;
  task: any;
  generalSettings: any;

  constructor(private route: ActivatedRoute, private router: Router, private expenseGroupsService: ExpenseGroupsService, private tasksService: TasksService, private billsService: BillsService, private expenseReportsService: ExpenseReportsService, private journalEntriesService: JournalEntriesService) { }

  createNetSuiteItems(expense_group_id: number) { 
    if (this.generalSettings.reimbursable_expenses_object){
        if(this.generalSettings.reimbursable_expenses_object == 'VENDOR BILL' && this.expenseGroup.fund_source == 'PERSONAL') {
          this.billsService.createBills(this.workspaceId, [expense_group_id]).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
        else if (this.generalSettings.reimbursable_expenses_object == 'EXPENSE REPORT' && this.expenseGroup.fund_source == 'PERSONAL') {
          this.expenseReportsService.createExpenseReports(this.workspaceId, [expense_group_id]).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
        else if (this.generalSettings.reimbursable_expenses_object == 'JOURNAL ENTRY' && this.expenseGroup.fund_source == 'PERSONAL') {
          this.journalEntriesService.createJournalEntries(this.workspaceId, [expense_group_id]).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
    }

    if (this.generalSettings.corporate_credit_card_expenses_object) {
        if (this.generalSettings.corporate_credit_card_expenses_object == 'JOURNAL ENTRY' && this.expenseGroup.fund_source == 'CCC') {
          this.journalEntriesService.createJournalEntries(this.workspaceId, [expense_group_id]).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
        else if (this.generalSettings.corporate_credit_card_expenses_object == 'EXPENSE REPORT' && this.expenseGroup.fund_source == 'CCC') {
          this.expenseReportsService.createExpenseReports(this.workspaceId, [expense_group_id]).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);

          });
        }
        else if (this.generalSettings.corporate_credit_card_expenses_object == 'VENDOR BILL' && this.expenseGroup.fund_source == 'CCC') {
          this.billsService.createBills(this.workspaceId, [expense_group_id]).subscribe(result => {
            this.router.navigateByUrl(`/workspaces/${this.workspaceId}/tasks`);
          });
        }
      // }
    }
  }

  openExpenseInFyle(expenseId: string) {
    const clusterDomain = localStorage.getItem('clusterDomain');
    window.open(`${clusterDomain}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  openBillInNetSuite() {
    let nsAccountId = localStorage.getItem('ns_account_id');
    window.open(`https://${nsAccountId}.app.netsuite.com/app/accounting/transactions/vendbill.nl?id=${this.task['detail']['internalId']}`, '_blank');
  }

  openExpenseReportInNetSuite() {
    let nsAccountId = localStorage.getItem('ns_account_id');
    window.open(`https://${nsAccountId}.app.netsuite.com/app/accounting/transactions/exprept.nl?id=${this.task['detail']['internalId']}`, '_blank');
  }

  openJournalEntryInNetSuite() {
    let nsAccountId = localStorage.getItem('ns_account_id');
    window.open(`https://${nsAccountId}.app.netsuite.com/app/accounting/transactions/journal.nl?id=${this.task['detail']['internalId']}`, '_blank');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.expenseGroupId = +params['expense_group_id'];
      this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'));

      forkJoin(
        [
          this.expenseGroupsService.getExpensesGroupById(this.workspaceId, this.expenseGroupId),
          this.expenseGroupsService.getExpensesByExpenseGroupId(this.workspaceId, this.expenseGroupId),
          this.tasksService.getTasksByExpenseGroupId(this.workspaceId, this.expenseGroupId)
        ]
      ).subscribe(response => {
        this.expenseGroup = response[0];
        this.expenses = response[1];
        if (response[2].length) {
          this.task = response[2][0];
        }
        this.isLoading = false;
      });
    });
  }

}