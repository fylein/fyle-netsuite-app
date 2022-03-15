import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from 'src/app/core/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/core/models/task.model';
import { MappingError } from 'src/app/core/models/mapping-error.model';
import { CategoryMapping } from 'src/app/core/models/category-mapping.model';
import { CategoryMappingsDialogComponent } from '../../../settings/category-mappings/category-mappings-dialog/category-mappings-dialog.component';
import { StorageService } from 'src/app/core/services/storage.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { CategoryMappingsResponse } from 'src/app/core/models/category-mapping-response.model';

@Component({
  selector: 'app-group-mapping-error',
  templateUrl: './group-mapping-error.component.html',
  styleUrls: ['./group-mapping-error.component.scss', '../../../netsuite.component.scss']
})
export class GroupMappingErrorComponent implements OnInit {

  isLoading = false;
  expenseGroupId: number;
  workspaceId: number;

  categoryMappings: CategoryMapping[];
  mappingErrors: MatTableDataSource<MappingError> = new MatTableDataSource([]);
  columnsToDisplay = ['category', 'message', 'type'];

  constructor(
    private taskService: TasksService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    public dialog: MatDialog,
    private router: Router,
    private mappingsService: MappingsService) { }

  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.snapshot.parent.params.workspace_id;
    that.expenseGroupId = +that.route.snapshot.parent.params.expense_group_id;
    that.isLoading = true;
    that.taskService.getTasksByExpenseGroupId(that.expenseGroupId).subscribe((task: Task) => {
      that.mappingErrors = new MatTableDataSource(task.detail);
      that.isLoading = false;
    });
  }

  open(selectedItem) {
    const that = this;
    if (selectedItem.type === 'Category Mapping' ) {

      const dialogRef = that.dialog.open(CategoryMappingsDialogComponent, {
        width: '450px',
        data: {
          workspaceId: that.workspaceId,
          categoryMappingRow: selectedItem,
          category: selectedItem.value
        }
      });
    }
  }

}
