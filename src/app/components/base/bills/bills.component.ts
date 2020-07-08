import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../bills/bills.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css', '../base.component.css'],
})
export class BillsComponent implements OnInit {
  workspaceId: number;
  bills: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit: number = 20;
  offset: number = 0;


  constructor(private route: ActivatedRoute, private router: Router, private billsService: BillsService) {}

  
  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedBills();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedBills();
  }

  getPaginatedBills() {
    this.billsService.getBills(this.workspaceId, this.limit, this.offset).subscribe(bills => {
      this.nextPageLink = bills.next;
      this.previousPageLink = bills.previous;
      this.count = bills.count;
      this.bills = bills.results;
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
      this.getPaginatedBills();
    });
  }
}
