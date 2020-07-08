import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from './tasks.service';
import { timer, interval, from } from 'rxjs';
import { scan, tap, delay, takeWhile, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css', '../base.component.css'],
})
export class TasksComponent implements OnInit {
  workspaceId: number;
  tasks: any;
  limit: number = 20;
  offset: number = 0;
  state: string = 'ALL';
  nextPageLink: string;
  previousPageLink: string;
  count: number;
  isLoading: boolean = true;
  inProgress: string = 'active';
  complete: string;
  failed: string;
  error: any[];

  constructor(private route: ActivatedRoute, private router: Router, private tasksService: TasksService) {}

  nextPage() {
    this.offset = this.offset + this.limit;
    this.isLoading = true;
    this.getPaginatedTasks();
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    this.isLoading = true;
    this.getPaginatedTasks();
  }
  
  changeState(state: string) {
    this.isLoading = true;
    this.offset = 0;
    if(state === 'ALL') {
      this.state = 'ALL';
      this.inProgress = 'active';
      this.complete = '';
      this.failed = '';
    } else if(state === 'COMPLETE') {
      this.state = 'COMPLETE';
      this.inProgress = '';
      this.complete = 'active';
      this.failed = '';
    } else if(state === 'FAILED') {
      this.state = 'FAILED';
      this.inProgress = '';
      this.complete = '';
      this.failed = 'active';
    }
    this.getPaginatedTasks();
  }

  getPaginatedTasks() {
    this.tasksService.getTasks(this.workspaceId, this.limit, this.offset, this.state).subscribe(tasks => {
      this.nextPageLink = tasks.next;
      this.previousPageLink = tasks.previous;
      this.count = tasks.count;
      this.tasks = tasks.results;
      this.isLoading = false;

      if(this.state === 'ALL') {
        interval(3000).pipe(
          switchMap(() => from(this.tasksService.getTasks(this.workspaceId, this.limit, this.offset, this.state))),
          takeWhile((response) => response['results'].filter(task => task.status === 'IN_PROGRESS').length, true)
        ).subscribe(response => {
          this.tasks = response['results'];
        })
      }
    });
  }

  goToExpenseGroup(id: number) {
    this.router.navigate([]).then(result => {
      window.open(`workspaces/${this.workspaceId}/expense_groups/${id}/view`, '_blank');
    });
  }

  showErrors(taskId: number, errors: any[]) {
    this.router.navigateByUrl(`workspaces/${this.workspaceId}/tasks/${taskId}/errors`, {queryParams: {errors: errors}});
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];
      this.getPaginatedTasks();
    });
  }
}
