import { Component, OnInit } from '@angular/core';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { ExpenseGroupsService } from 'src/app/core/services/expense-groups.service';
import { ActivatedRoute } from '@angular/router';
import { BillsService } from 'src/app/core/services/bills.service';
import { JournalEntriesService } from '../../../core/services/journal-entries.service';
import { ExpenseReportsService } from '../../../core/services/expense-reports.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { interval, from, forkJoin } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss', '../../netsuite.component.scss']
})
export class ExportComponent implements OnInit {

  isLoading: boolean;
  isExporting: boolean;
  workspaceId: number;
  exportableExpenseGroups: ExpenseGroup[];
  generalSettings: any;
  failedExpenseGroupCount = 0;
  successfulExpenseGroupCount = 0;
  windowReference: Window;

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService,
    private expenseGroupService: ExpenseGroupsService,
    private journalEntriesService: JournalEntriesService,
    private billsService: BillsService,
    private expenseReportsService: ExpenseReportsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  exportReimbursableExpenses(reimbursableExpensesObject) {
    const that = this;
    const handlerMap = {
      'BILL': (filteredIds) => {
        return that.billsService.createBills(filteredIds);
      },
      'EXPENSE REPORT': (filteredIds) => {
        return that.expenseReportsService.createExpenseReports(filteredIds);
      },
      'JOURNAL ENTRY': (filteredIds) => {
        return that.journalEntriesService.createJournalEntries(filteredIds);
      }
    };

    return handlerMap[reimbursableExpensesObject] || handlerMap["JOURNAL ENTRY"];
  }

  exportCCCExpenses(corporateCreditCardExpensesObject) {
    const that = this;
    const handlerMap = {
      'BILL': (filteredIds) => {
        return that.billsService.createBills(filteredIds);
      },
      'EXPENSE REPORT': (filteredIds) => {
        return that.expenseReportsService.createExpenseReports(filteredIds);
      },
      'JOURNAL ENTRY': (filteredIds) => {
        return that.journalEntriesService.createJournalEntries(filteredIds);
      }
    };

    return handlerMap[corporateCreditCardExpensesObject] || handlerMap["JOURNAL ENTRY"];
  }

  openFailedExports() {
    const that = this;
    this.windowReference.open(`workspaces/${that.workspaceId}/expense_groups?state=FAILED`, '_blank');
  }

  openSuccessfulExports() {
    const that = this;
    this.windowReference.open(`workspaces/${that.workspaceId}/expense_groups?state=COMPLETE`, '_blank');
  }

  checkResultsOfExport(filteredIds) {
    const that = this;
    interval(3000).pipe(
      switchMap(() => from(that.taskService.getTasks(10, 0, 'ALL'))),
      takeWhile((response) => response.results.filter(task => task.status === 'IN_PROGRESS').length > 0, true)
    ).subscribe((res) => {
      if (res.results.filter(task => task.status === 'IN_PROGRESS').length === 0) {
        that.taskService.getAllTasks('FAILED').subscribe((taskResponse) => {
          that.failedExpenseGroupCount = taskResponse.count;
          that.successfulExpenseGroupCount = filteredIds.length - that.failedExpenseGroupCount;
          that.isExporting = false;
          that.loadExportableExpenseGroups();
          that.snackBar.open('Export Complete');
        });
      }
    });
  }

  createNetSuiteItems() {
    const that = this;
    that.isExporting = true;
    that.settingsService.getCombinedSettings(that.workspaceId).subscribe((settings) => {
      that.generalSettings = settings;
      const promises = [];
      let allFilteredIds = [];
      if (that.generalSettings.reimbursable_expenses_object) {
        const filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source === 'PERSONAL').map(expenseGroup => expenseGroup.id);
        if (filteredIds.length > 0) {
          // TODO: remove promises and do with rxjs observables
          promises.push(that.exportReimbursableExpenses(that.generalSettings.reimbursable_expenses_object)(filteredIds).toPromise());
          allFilteredIds = allFilteredIds.concat(filteredIds);
        }
      }

      if (that.generalSettings.corporate_credit_card_expenses_object) {
        const filteredIds = that.exportableExpenseGroups.filter(expenseGroup => expenseGroup.fund_source === 'CCC').map(expenseGroup => expenseGroup.id);
        if (filteredIds.length > 0) {
          // TODO: remove promises and do with rxjs observables
          promises.push(that.exportCCCExpenses(that.generalSettings.corporate_credit_card_expenses_object)(filteredIds).toPromise());

          allFilteredIds = allFilteredIds.concat(filteredIds);
        }
      }
      // TODO: remove promises and do with rxjs observables
      if (promises.length > 0) {
        forkJoin(
          promises
        ).subscribe(() => {
          that.checkResultsOfExport(allFilteredIds);
        });
      }
    });
  }

  loadExportableExpenseGroups() {
    const that = this;
    that.isLoading = true;
    that.expenseGroupService.getAllExpenseGroups('READY').subscribe((res) => {
      that.exportableExpenseGroups = res.results;
      that.isLoading = false;
    });
  }


  ngOnInit() {
    const that = this;

    that.isExporting = false;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;

    that.isLoading = true;
    that.loadExportableExpenseGroups();
  }

}