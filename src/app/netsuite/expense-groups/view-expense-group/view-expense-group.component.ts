import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseGroupsService } from '../../../core/services/expense-groups.service';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TasksService } from '../../../core/services/tasks.service';
import { ExpenseGroup } from 'src/app/core/models/expense-group.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';

@Component({
  selector: 'app-view-expense-group',
  templateUrl: './view-expense-group.component.html',
  styleUrls: ['./view-expense-group.component.scss', '../expense-groups.component.scss', '../../netsuite.component.scss']
})
export class ViewExpenseGroupComponent implements OnInit {
  workspaceId: number;
  expenseGroupId: number;
  expenses: ExpenseGroup[];
  isLoading = true;
  expenseGroup: ExpenseGroup;
  state: string;
  pageSize: number;
  pageNumber: number;
  status: string;
  windowReference: Window;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseGroupsService: ExpenseGroupsService,
    private tasksService: TasksService,
    private storageService: StorageService,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }

  changeState(state: string) {
    const that = this;
    if (that.state !== state) {
      that.state = state;
      that.router.navigate([`workspaces/${this.workspaceId}/expense_groups/${this.expenseGroupId}/view/${state.toLowerCase()}`]);
    }
  }

  openExpenseInFyle(expenseId: string) {
    const clusterDomain = this.storageService.get('clusterDomain');
    this.windowReference.open(`${environment.fyle_app_url}/app/main/#/enterprise/view_expense/${expenseId}`, '_blank');
  }

  ngOnInit() {
    const that = this;

    that.workspaceId = +that.route.snapshot.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.params.expense_group_id;
    that.state = that.route.snapshot.firstChild.routeConfig.path.toUpperCase() || 'INFO';

    forkJoin([
      that.expenseGroupsService.getExpensesGroupById(that.expenseGroupId),
      that.tasksService.getTasksByExpenseGroupId(that.expenseGroupId)
    ]).subscribe(response => {
      that.expenseGroup = response[0];
      that.status = response[1].status;

      that.isLoading = false;
    });
  }

}
