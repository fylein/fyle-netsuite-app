import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomSegmentsDialogComponent } from './custom-segments-dialog/custom-segments-dialog.component';
import { CustomSegment } from 'src/app/core/models/custom-segment.model';

@Component({
  selector: 'app-custom-segments',
  templateUrl: './custom-segments.component.html',
  styleUrls: ['./custom-segments.component.scss', '../../../netsuite.component.scss']
})
export class CustomSegmentsComponent implements OnInit {
  workspaceId: number;
  isLoading: boolean;
  customMappings: CustomSegment[];
  columnsToDisplay = ['name', 'script_id', 'internal_id', 'type'];

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private mappingsService: MappingsService) {}

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  open() {
    const that = this;
    const dialogRef = that.dialog.open(CustomSegmentsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      that.reset();
    });
  }

  reset() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getNetsuiteExpenseSegments().subscribe((lists) => {
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
