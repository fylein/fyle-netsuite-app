import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomRecordsDialogComponent } from './custom-records-dialog/custom-records-dialog.component';

@Component({
  selector: 'app-custom-records',
  templateUrl: './custom-records.component.html',
  styleUrls: ['./custom-records.component.scss', '../../../netsuite.component.scss']
})
export class CustomRecordsComponent implements OnInit {
  workspaceId: number;
  isLoading: boolean;
  customMappings: any;
  columnsToDisplay = ['script_id', 'internal_id', 'type'];

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private mappingsService: MappingsService) {}

   open() {
    const that = this;
    const dialogRef = that.dialog.open(CustomRecordsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Do nothing
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getNetsuiteExpenseCustomLists().subscribe((lists) => {
      that.customMappings = lists;
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.reset();
  }
}
