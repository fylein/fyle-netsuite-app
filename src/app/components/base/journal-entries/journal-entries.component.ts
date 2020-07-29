import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {JournalEntriesService} from '../journal-entries/journal-entries.service'

@Component({
  selector: 'app-journal-entries',
  templateUrl: './journal-entries.component.html',
  styleUrls: ['./journal-entries.component.css', '../base.component.css']
})
export class JournalEntriesComponent implements OnInit {
  workspaceId: number;
  journalEntries: [any];
  isLoading = true;
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  limit: number = 20;
  offset: number = 0;


  constructor(private route: ActivatedRoute, private router: Router, private journalEntriesService: JournalEntriesService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedJournalEntries();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedJournalEntries();
  }

  getPaginatedJournalEntries() {
    this.journalEntriesService.getJournalEntries(this.workspaceId, this.limit, this.offset).subscribe(journalEntries => {
      this.nextPageLink = journalEntries.next;
      this.previousPageLink = journalEntries.previous;
      this.count = journalEntries.count;
      this.journalEntries = journalEntries.results;
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
      this.getPaginatedJournalEntries();
    });
  }
}
