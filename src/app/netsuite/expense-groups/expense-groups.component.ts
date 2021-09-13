import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, ActivationEnd } from '@angular/router';
import { ExpenseGroupsService } from '../../core/services/expense-groups.service';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { Subscription } from 'rxjs';
import { ExpenseGroupResponse } from 'src/app/core/models/expense-group-response.model';
import { NetSuiteResponseLog } from 'src/app/core/models/netsuite-response-log.model';

@Component({
  selector: 'app-expense-groups',
  templateUrl: './expense-groups.component.html',
  styleUrls: ['./expense-groups.component.scss', '../netsuite.component.scss'],
})
export class ExpenseGroupsComponent implements OnInit, OnDestroy {
  workspaceId: number;
  expenseGroups: MatTableDataSource<ExpenseGroup> = new MatTableDataSource([]);
  isLoading = true;
  count: number;
  state: string;
  settings: GeneralSetting;
  pageNumber = 0;
  pageSize: number;
  columnsToDisplay = ['employee', 'expensetype'];
  exportTypeRedirectionMap = {
    vendorBill: 'vendbill',
    expenseReport: 'exprept',
    journalEntry: 'journal',
    chargeCard: 'cardchrg'
  };
  exportTypeDisplayNameMap = {
    vendorBill: 'Bill',
    expenseReport: 'Expense Report',
    journalEntry: 'Journal Entry',
    chargeCard: 'Credit Card Charge'
  };
  windowReference: Window;
  routerEventSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private expenseGroupService: ExpenseGroupsService,
    private router: Router,
    private settingsService: SettingsService,
    private windowReferenceService: WindowReferenceService,
    private storageService: StorageService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenseGroups.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event) {
    const that = this;

    that.isLoading = true;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        page_number: event.pageIndex,
        page_size: event.pageSize,
        state: that.state
      }
    };

    that.router.navigate([`workspaces/${that.workspaceId}/expense_groups`], navigationExtras);
  }


  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.isLoading = true;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          page_number: 0,
          page_size: that.pageSize,
          state
        }
      };

      that.router.navigate([`workspaces/${that.workspaceId}/expense_groups`], navigationExtras);
    }
  }

  generateExportTypeAndRedirection(responseLogs: NetSuiteResponseLog): [string, string] {
    if (responseLogs) {
      const exportType = responseLogs.type || 'chargeCard';

      return [this.exportTypeDisplayNameMap[exportType], this.exportTypeRedirectionMap[exportType]];
    }

    return [null, null];
  }

  getPaginatedExpenseGroups() {
    const that = this;

    return that.expenseGroupService.getExpenseGroups(that.pageSize, that.pageNumber * that.pageSize, that.state).subscribe((expenseGroups: ExpenseGroupResponse) => {
      that.count = expenseGroups.count;
      expenseGroups.results.forEach(expenseGroup => {
        const [exportType, _] = that.generateExportTypeAndRedirection(expenseGroup.response_logs);
        expenseGroup.export_type = exportType;
      });
      that.expenseGroups = new MatTableDataSource(expenseGroups.results);
      that.expenseGroups.filterPredicate = that.searchByText;
      that.isLoading = false;
      return expenseGroups;
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${id}/view`]);
  }

  reset() {
    const that = this;
    that.workspaceId = +that.route.snapshot.params.workspace_id;
    that.pageNumber = +that.route.snapshot.queryParams.page_number || 0;
    let cachedPageSize = that.storageService.get('expense-groups.pageSize') || 10;
    that.pageSize = +that.route.snapshot.queryParams.page_size || cachedPageSize;
    that.state = that.route.snapshot.queryParams.state || 'FAILED';
    that.settingsService.getGeneralSettings().subscribe((settings) => {
      if (that.state === 'COMPLETE') {
        that.columnsToDisplay = ['export-date', 'employee', 'export', 'expensetype', 'openNetSuite'];
      } else {
        that.columnsToDisplay = ['employee', 'expensetype'];
      }

      that.settings = settings;
      that.getPaginatedExpenseGroups();
    });

    that.routerEventSubscription = that.router.events.subscribe(event => {
      if (event instanceof ActivationEnd && that.router.url === `/workspaces/${that.workspaceId}/expense_groups?page_number=${+event.snapshot.queryParams.page_number}&page_size=${event.snapshot.queryParams.page_size}&state=${event.snapshot.queryParams.state}`) {
        const pageNumber = +event.snapshot.queryParams.page_number || 0;

        if (+event.snapshot.queryParams.page_size) {
          that.storageService.set('expense-groups.pageSize', +event.snapshot.queryParams.page_size);
          cachedPageSize = +event.snapshot.queryParams.page_size;
        }

        const pageSize = +event.snapshot.queryParams.page_size || cachedPageSize;
        const state = event.snapshot.queryParams.state || 'FAILED';

        if (that.pageNumber !== pageNumber || that.pageSize !== pageSize || that.state !== state) {
          if (state === 'COMPLETE') {
            that.columnsToDisplay = ['export-date', 'employee', 'export', 'expensetype', 'openNetSuite'];
          } else {
            that.columnsToDisplay = ['employee', 'expensetype'];
          }

          that.pageNumber = pageNumber;
          that.pageSize = pageSize;
          that.state = state;
          that.getPaginatedExpenseGroups();
        }
      }
    });
  }

  openInNetSuite(type: string, id: string) {
    const nsAccountId = JSON.parse(localStorage.getItem('nsAccountId'));
    this.windowReference.open(`https://${nsAccountId}.app.netsuite.com/app/accounting/transactions/${type}.nl?id=${id}`, '_blank');
  }

  openInNetSuiteHandler(clickedExpenseGroup: ExpenseGroup) {
    // tslint:disable-next-line: deprecation
    event.preventDefault();
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
    const that = this;
    const [_, exportRedirection] = that.generateExportTypeAndRedirection(clickedExpenseGroup.response_logs);

    that.openInNetSuite(exportRedirection, clickedExpenseGroup.response_logs.internalId);
  }

  searchByText(data: ExpenseGroup, filterText: string) {
    return data.description.employee_email.includes(filterText) ||
      ('Reimbursable'.toLowerCase().includes(filterText) && data.fund_source === 'PERSONAL') ||
      ('Corporate Credit Card'.toLowerCase().includes(filterText) && data.fund_source !== 'PERSONAL') ||
      data.description.claim_number.includes(filterText);
  }

  ngOnInit() {
    this.reset();
    this.expenseGroups.filterPredicate = this.searchByText;
    this.settingsService.getNetSuiteCredentials().subscribe(creds => {
      this.storageService.set('nsAccountId', (creds.ns_account_id).toLowerCase());
    });
  }

  ngOnDestroy() {
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe();
    }
  }
}
