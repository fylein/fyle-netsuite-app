import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { WindowReferenceService } from 'src/app/core/services/window.service';
import { ActivatedRoute, Router } from '@angular/router';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-custom-segments-dialog',
  templateUrl: './custom-segments-dialog.component.html',
  styleUrls: ['./custom-segments-dialog.component.scss', '../../../settings.component.scss']
})
export class CustomSegmentsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  workSpaceId: number;

  matcher = new MappingErrorStateMatcher();
  windowReference: Window;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomSegmentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mappingsService: MappingsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private windowReferenceService: WindowReferenceService) {
      this.windowReference = this.windowReferenceService.nativeWindow;
    }


  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    const that = this;
    that.isLoading = true;

    const customFields = {
      internal_id: that.form.value.internal_id,
      script_id: that.form.value.script_id,
      segment_type: that.form.value.custom_field_type
    };

    that.mappingsService.postNetsuiteCustomSegments(customFields).subscribe(response => {
      that.snackBar.open('Syncing Custom Record from Netsuite');
      that.mappingsService.postNetsuiteExpenseCustomFields(true).subscribe(res => {
        that.dialogRef.close();
        that.snackBar.open('Custom Record successfully added to Expense Fields');
        // that.router.navigate([`workspaces/${that.workSpaceId}/dashboard`]).then(() => {
        //   that.windowReference.location.reload();
        // });
        that.router.navigateByUrl(`/workspaces/${that.workSpaceId}/settings/configurations/expense_fields`);
      })
    }, (err) => {
      that.snackBar.open('Invalid Custom Record fields, please try again');
      that.isLoading = false;
    });
  }

  ngOnInit() {
    const that = this;
    
    that.workSpaceId = that.data.workspaceId;
    that.form = that.formBuilder.group({
      script_id: ['', [Validators.required]],
      internal_id: ['', [Validators.required]],
      custom_field_type: ['', [Validators.required]]
    });
  }

}
