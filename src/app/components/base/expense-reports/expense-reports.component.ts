import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ExpenseReportsService} from '../expense-reports/expense-reports.service'

@Component({
  selector: 'app-expense-reports',
  templateUrl: './expense-reports.component.html',
  styleUrls: ['./expense-reports.component.css', '../base.component.css']
})
export class ExpenseReportsComponent implements OnInit {
  workspaceId: number;
  expenseReports: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit: number = 20;
  offset: number = 0;


  constructor(private route: ActivatedRoute, private router: Router, private expenseReportsService: ExpenseReportsService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedExpenseReports();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedExpenseReports();
  }

  getPaginatedExpenseReports() {
    this.expenseReportsService.getExpenseReports(this.workspaceId, this.limit, this.offset).subscribe(expenseReports => {
      this.nextPageLink = expenseReports.next;
      this.previousPageLink = expenseReports.previous;
      this.count = expenseReports.count;
      this.expenseReports = expenseReports.results;
      this.isLoading = false;
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([]).then(result => {
      window.open(`workspaces/${this.workspaceId}/expense_groups/${id}/view`, '_blank')
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.getPaginatedExpenseReports();
    });
  }
}
