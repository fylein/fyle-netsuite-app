import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { SettingsService } from 'src/app/core/services/settings.service';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingModal } from 'src/app/core/models/mapping-modal.model';
import { MappingSource } from 'src/app/core/models/mapping-source.model';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';

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
  isLoading: boolean;
  form: FormGroup;
  fyleCategories: MappingSource[];
  netsuiteAccounts: MappingDestination[];
  netsuiteExpenseCategories: MappingDestination[];
  fyleCategoryOptions: MappingSource[];
  workspaceId: number;
  netsuiteAccountOptions: MappingDestination[];
  netsuiteExpenseCategoryOptions: MappingDestination[];
  netsuiteCCCAccountOptions: MappingDestination[];
  generalSettings: GeneralSetting;
  cccAccounts: MappingDestination[];
  editMapping: boolean;
  matcher = new MappingErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CategoryMappingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MappingModal,
              private mappingsService: MappingsService,
              private snackBar: MatSnackBar, private settingsService: SettingsService
              ) { }

  mappingDisplay(mappingObject) {
    return mappingObject ? mappingObject.value : '';
  }

  forbiddenSelectionValidator(options: (MappingSource|MappingDestination)[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
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
      const mappings = [];

      if (that.form.controls.netsuiteAccount.value && that.generalSettings.reimbursable_expenses_object !== 'EXPENSE REPORT') {
        mappings.push(that.mappingsService.postMappings({
          source_type: 'CATEGORY',
          destination_type: 'ACCOUNT',
          source_value: that.form.controls.fyleCategory.value.value,
          destination_value: that.form.controls.netsuiteAccount.value.value,
          destination_id: that.form.controls.netsuiteAccount.value.destination_id
        }));
      } else if (that.form.controls.netsuiteExpenseCategory.value && that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT') {
        mappings.push(that.mappingsService.postMappings({
          source_type: 'CATEGORY',
          destination_type: 'EXPENSE_CATEGORY',
          source_value: that.form.controls.fyleCategory.value.value,
          destination_value: that.form.controls.netsuiteExpenseCategory.value.value,
          destination_id: that.form.controls.netsuiteExpenseCategory.value.destination_id
        }));
      }

      if (this.generalSettings.corporate_credit_card_expenses_object) {
        let destinationValue = that.form.controls.cccAccount.value.value;
        let destinationId = that.form.controls.cccAccount.value.destination_id;
        let destinationType = that.generalSettings.corporate_credit_card_expenses_object !== 'EXPENSE REPORT' ? 'CCC_ACCOUNT' : 'CCC_EXPENSE_CATEGORY';

        if (!that.form.value.cccAccount) {
          if (that.generalSettings.corporate_credit_card_expenses_object !== 'EXPENSE REPORT') {
            destinationValue = that.form.controls.netsuiteAccount.value.value;
            destinationId = that.form.controls.netsuiteAccount.value.destination_id;
          } else {
            destinationType = 'CCC_EXPENSE_CATEGORY';
            destinationValue = that.form.controls.netsuiteExpenseCategory.value.value;
            destinationId = that.form.controls.netsuiteExpenseCategory.value.destination_id;
          }
        }

        mappings.push(that.mappingsService.postMappings({
          source_type: 'CATEGORY',
          destination_type: destinationType,
          source_value: that.form.controls.fyleCategory.value.value,
          destination_value: destinationValue,
          destination_id: destinationId
        }));
      }

      forkJoin(mappings).subscribe(response => {
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
        that.netsuiteAccountOptions = that.netsuiteAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
      }
    });
  }

  setupNetSuiteExpenseCategoryWatchers() {
    const that = this;

    that.form.controls.netsuiteExpenseCategory.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        that.netsuiteExpenseCategoryOptions = that.netsuiteExpenseCategories.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
      }
    });
  }

  showSeparateCCCField() {
    const that = this;
    if (that.generalSettings.corporate_credit_card_expenses_object) {
      if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' || that.generalSettings.corporate_credit_card_expenses_object === 'EXPENSE REPORT') {
        if (that.generalSettings.reimbursable_expenses_object !== that.generalSettings.corporate_credit_card_expenses_object) {
          return true;
        }
      }
    }
    return false;
  }

  setupNetSuiteCCCAccountWatchers() {
    const that = this;

    that.form.controls.cccAccount.valueChanges.pipe(debounceTime(300)).subscribe((newValue) => {
      if (typeof(newValue) === 'string') {
        if (that.generalSettings.corporate_credit_card_expenses_object === 'EXPENSE REPORT') {
          that.cccAccounts = that.netsuiteExpenseCategories.slice();
          that.netsuiteCCCAccountOptions = that.cccAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
        } else {
          that.netsuiteCCCAccountOptions = that.cccAccounts.filter(netsuiteAccount => new RegExp(newValue.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase()));
        }
      }
    });
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleCateogryWatchers();
    that.setupNetSuiteAccountWatchers();
    that.setupNetSuiteCCCAccountWatchers();
    that.setupNetSuiteExpenseCategoryWatchers();
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.data.workspaceId;

    if (that.data.rowElement) {
      that.editMapping = true;
    }

    that.isLoading = true;
    forkJoin([
      that.mappingsService.getFyleCategories(),
      that.mappingsService.getExpenseAccounts(),
      that.mappingsService.getExpenseCategories(),
      that.settingsService.getGeneralSettings(that.workspaceId)
    ]).subscribe((res) => {
      that.fyleCategories = res[0];
      that.netsuiteAccounts = res[1];
      that.cccAccounts = res[1];
      that.netsuiteExpenseCategories = res[2];
      that.generalSettings = res[3];

      that.isLoading = false;
      const fyleCategory = that.editMapping ? that.fyleCategories.filter(category => category.value === that.data.rowElement.fyle_value)[0] : '';
      const netsuiteAccount = that.editMapping ? that.netsuiteAccounts.filter(nsAccObj => nsAccObj.value === that.data.rowElement.netsuite_value)[0] : '';
      const cccAccount = that.editMapping ? that.cccAccounts.filter(cccObj => cccObj.value === that.data.rowElement.ccc_value)[0] : '';
      const netsuiteExpenseCategory = that.editMapping ? that.netsuiteExpenseCategories.filter(nsAccObj => nsAccObj.value === that.data.rowElement.netsuite_value)[0] : '';
      that.form = that.formBuilder.group({
        fyleCategory: [fyleCategory, Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleCategories)])],
        netsuiteAccount: [netsuiteAccount, that.generalSettings.reimbursable_expenses_object !== 'EXPENSE REPORT' ? that.forbiddenSelectionValidator(that.netsuiteAccounts) : null],
        netsuiteExpenseCategory: [netsuiteExpenseCategory, that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' ? that.forbiddenSelectionValidator(that.netsuiteExpenseCategories) : null],
        cccAccount: [cccAccount || '', that.showSeparateCCCField() ? that.forbiddenSelectionValidator(that.generalSettings.corporate_credit_card_expenses_object !== 'EXPENSE REPORT' ? that.cccAccounts : that.netsuiteExpenseCategories) : null]
      });

      if (that.editMapping) {
        that.form.controls.fyleCategory.disable();
      }

      that.setupAutocompleteWatchers();
    });
  }
}
