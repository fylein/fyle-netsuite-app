import { Component, OnInit, Input } from '@angular/core';
import { TasksService } from '../tasks.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mapping-errors',
  templateUrl: './mapping-errors.component.html',
  styleUrls: ['./mapping-errors.component.css', '../tasks.component.css', '../../base.component.css']
})
export class MappingErrorsComponent implements OnInit {
  errors: any[];
  task: any;
  isLoading: boolean = true;
  workspaceId: number;

  constructor(private tasksService: TasksService, private route: ActivatedRoute, private router: Router) { }

  goToExpenseGroup(id: number) {
    this.router.navigate([]).then(result => {
      window.open(`workspaces/${this.workspaceId}/expense_groups/${id}/view`, '_blank');
    });
  }

  ngOnInit() {
    let params = this.route.snapshot.params
    let taskId = +params['task_id'];
    this.workspaceId = +params['workspace_id']
    this.tasksService.getTaskById(this.workspaceId, taskId).subscribe(response => {
      if (response.length && response[0].detail.length) {
        this.task = response[0];
        this.errors = this.task['detail'];
      } else {
        this.router.navigateByUrl('/workspaces');
      }
      this.isLoading = false;
    });
  }

}
