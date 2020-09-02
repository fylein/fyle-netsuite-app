import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MappingErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-category-mappings-dialog',
  templateUrl: './category-mappings-dialog.component.html',
  styleUrls: ['./category-mappings-dialog.component.scss', '../../settings.component.scss']
})
export class CategoryMappingsDialogComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  fyleCategories: any[];
  netsuiteAccounts: any[];
  fyleCategoryOptions: any[];
  netsuiteAccountOptions: any[];
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CategoryMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar
              ) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
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

  submit() {
    const that = this;
    if (that.form.valid) {
      that.isLoading = true;
      that.mappingsService.postMappings({
        source_type: 'CATEGORY',
        destination_type: 'ACCOUNT',
        source_value: that.form.controls.fyleCategory.value.value,
        destination_value: that.form.controls.netsuiteAccount.value.value
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

  setupFyleCateogryWatchers() {
    const that = this;
    that.form.controls.fyleCategory.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.fyleCategoryOptions = that.fyleCategories
        .filter(fyleCategory => new RegExp(newValue.toLowerCase(), 'g').test(fyleCategory.value.toLowerCase()));
      }
    });
  }

  setupNetSuiteAccountWatchers() {
    const that = this;

    that.form.controls.netsuiteAccount.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.netsuiteAccountOptions = that.netsuiteAccounts
        .filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
      }
    });
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleCateogryWatchers();
    that.setupNetSuiteAccountWatchers();
  }

  ngOnInit() {
    const that = this;
    // TODO: remove promises and do with rxjs observables
    const getFyleCateogories = that.mappingsService.getFyleCategories().toPromise().then(fyleCategories => {
      that.fyleCategories = fyleCategories;
    });
    
    // TODO: remove promises and do with rxjs observables
    const getExpenseAccounts = that.mappingsService.getExpenseAccounts().toPromise().then(netsuiteAccounts => {
      that.netsuiteAccounts = netsuiteAccounts;
    });

    that.isLoading = true;
    forkJoin([
      getFyleCateogories,
      getExpenseAccounts
    ]).subscribe(() => {
      that.isLoading = false;

      that.form = that.formBuilder.group({
        fyleCategory: ['', Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleCategories)])],
        netsuiteAccount: ['', Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.netsuiteAccounts)])]
      });

      that.setupAutocompleteWatchers();
    });
  }
}
