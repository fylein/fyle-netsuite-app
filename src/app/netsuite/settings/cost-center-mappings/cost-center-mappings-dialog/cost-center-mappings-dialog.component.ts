import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-cost-center-mappings-dialog',
  templateUrl: './cost-center-mappings-dialog.component.html',
  styleUrls: ['./cost-center-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class CostCenterMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  fyleCostCenters: any[];
  netsuiteElements: any[];
  fyleCostCenterOptions: any[];
  netsuiteOptions: any[];
  generalSettings: any;
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CostCenterMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService,
              private settingsService: SettingsService,
              private snackBar: MatSnackBar) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  submit() {
    const that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings({
        source_type: 'COST_CENTER',
        destination_type: that.generalSettings.cost_center_field_mapping,
        source_value: that.form.controls.fyleCostCenter.value.value,
        destination_value: that.form.controls.netsuiteObject.value.value
      }).subscribe(response => {
        that.snackBar.open('Mapping saved successfully');
        that.isLoading = false;
        that.dialogRef.close();
      }, err => {
        that.snackBar.open('Something went wrong');
        that.isLoading = false;
      });
    } else {
      that.snackBar.open('Form has invalid fields');
      that.form.markAllAsTouched();
    }
  }

  forbiddenSelectionValidator(options: any[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = !options.some((option) => {
        return control.value.id && option.id === control.value.id;
      });
      return forbidden ? {
        forbiddenOption: {
          value: control.value
        }
      } : null;
    };
  }

  setupCostCenterWatcher() {
    const that = this;

    that.form.controls.fyleCostCenter.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.fyleCostCenterOptions = that.fyleCostCenters
          .filter(fyleCostCenter => new RegExp(newValue.toLowerCase(), 'g').test(fyleCostCenter.value.toLowerCase()));
      }
    });
  }

  setupNetSuiteObjectWatcher() {
    const that = this;

    that.form.controls.netsuiteObject.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof (newValue) === 'string') {
        that.netsuiteOptions = that.netsuiteElements
          .filter(netsuiteElement => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteElement.value.toLowerCase()));
      }
    });
  }

  setupAutcompleteWathcers() {
    const that = this;
    that.setupCostCenterWatcher();
    that.setupNetSuiteObjectWatcher();
  }

  reset() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    const getFyleCostCenters = that.mappingsService.getFyleCostCenters().toPromise().then(costCenters => {
      that.fyleCostCenters = costCenters;
    });

    let netsuitePromise;
    if (this.generalSettings.cost_center_field_mapping === 'CLASS') {
      // TODO: remove promises and do with rxjs observables
      netsuitePromise = that.mappingsService.getNetSuiteClasses().toPromise().then(objects => {
        that.netsuiteElements = objects;
      });
    } else if (this.generalSettings.cost_center_field_mapping === 'DEPARTMENT') {
      netsuitePromise = that.mappingsService.getNetSuiteDepartments().toPromise().then(objects => {
        that.netsuiteElements = objects;
      });
    }

    that.isLoading = true;
    // TODO: remove promises and do with rxjs observables
    forkJoin([
      getFyleCostCenters,
      netsuitePromise
    ]).subscribe(() => {
      that.isLoading = false;
      that.form = that.formBuilder.group({
        fyleCostCenter: ['', Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleCostCenters)])],
        netsuiteObject: ['', Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.netsuiteElements)])]
      });

      that.setupAutcompleteWathcers();
    });
  }

  ngOnInit() {
    const that = this;
    that.isLoading = true;
    that.settingsService.getCombinedSettings(that.data.workspaceId).subscribe((settings) => {
      that.isLoading = false;
      that.generalSettings = settings;
      that.reset();
    });
  }
}
