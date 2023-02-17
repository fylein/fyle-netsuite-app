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
import { CategoryMapping } from 'src/app/core/models/category-mapping.model';

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
  generalSettings: GeneralSetting;
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
    return (control: AbstractControl): { [key: string]: object } | null => {
      if (control.value) {
        const forbidden = !options.some((option) => {
          return control.value && control.value.id && option && option.id === control.value.id;
        });
        return forbidden ? {
          forbiddenOption: {
            value: control.value
          }
        } : null;
      }

      return null;
    };
  }

  submit() {
    const that = this;

    const sourceId = that.form.controls.fyleCategory.value.id;
    const destinationAccountId = that.form.controls.netsuiteAccount.value ? that.form.controls.netsuiteAccount.value.id : null;
    const destinationExpenseHeadId = that.form.controls.netsuiteExpenseCategory.value ? that.form.controls.netsuiteExpenseCategory.value.id : null;

    if (that.form.valid && (destinationAccountId || destinationExpenseHeadId)) {
      that.isLoading = true;

      const categoryMappingsPayload: CategoryMapping = {
        source_category: {
          id: sourceId
        },
        destination_account: {
          id: destinationAccountId
        },
        destination_expense_head: {
          id: destinationExpenseHeadId
        },
        workspace: that.workspaceId
      };

      that.mappingsService.postCategoryMappings(categoryMappingsPayload).subscribe(() => {
        that.snackBar.open(that.data.category ? 'Category is mapped successfully, you can try re-exporting the failed entries' : 'Category Mapping saved successfully');
        that.isLoading = false;
        that.dialogRef.close();
      }, () => {
        that.isLoading = false;
        that.snackBar.open('Error saving Category Mapping');
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
    if (that.generalSettings.corporate_credit_card_expenses_object && that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' &&  that.generalSettings.corporate_credit_card_expenses_object !== 'EXPENSE REPORT') {
      return true;
    }

    return false;
  }

  setupAutocompleteWatchers() {
    const that = this;
    that.setupFyleCateogryWatchers();
    that.setupNetSuiteAccountWatchers();
    that.setupNetSuiteExpenseCategoryWatchers();
  }

  getAttributesFilteredByConfig() {
    const that = this;
    const attributes = [];

    if (that.generalSettings.reimbursable_expenses_object !== 'EXPENSE REPORT' || (that.showSeparateCCCField() && that.generalSettings.corporate_credit_card_expenses_object !== 'EXPENSE REPORT')) {
      attributes.push('ACCOUNT');
    }

    if (that.generalSettings.reimbursable_expenses_object === 'EXPENSE REPORT' || (that.showSeparateCCCField() && that.generalSettings.corporate_credit_card_expenses_object === 'EXPENSE REPORT')) {
      attributes.push('EXPENSE_CATEGORY');
    }

    return attributes;
  }

  reset() {
    const that = this;

    const attributes = that.getAttributesFilteredByConfig();
    forkJoin([
      that.mappingsService.getFyleExpenseAttributes('CATEGORY', true),
      that.mappingsService.getGroupedNetSuiteDestinationAttributes(attributes, true)
    ]).subscribe((res) => {
      that.fyleCategories = res[0];
      that.netsuiteAccounts = res[1].ACCOUNT;
      that.netsuiteExpenseCategories = res[1].EXPENSE_CATEGORY;

      that.isLoading = false;
      if (that.data.category) {
        const fyleCategory = that.fyleCategories.filter(category => category.value === that.data.category)[0];
        that.form = that.formBuilder.group({
          fyleCategory: [fyleCategory, Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleCategories)])],
          netsuiteAccount: [''],
          netsuiteExpenseCategory: ['']
        });
      } else {
        const fyleCategory = that.editMapping ? that.fyleCategories.filter(category => category.value === that.data.categoryMappingRow.source_category.value)[0] : '';
        const netsuiteAccount = that.editMapping ? that.netsuiteAccounts.filter(nsAccObj => that.data.categoryMappingRow.destination_account && nsAccObj.value === that.data.categoryMappingRow.destination_account.value)[0] : '';
        const netsuiteExpenseCategory = that.editMapping ? that.netsuiteExpenseCategories.filter(nsAccObj => that.data.categoryMappingRow.destination_expense_head && nsAccObj.value === that.data.categoryMappingRow.destination_expense_head.value)[0] : '';
        that.form = that.formBuilder.group({
          fyleCategory: [fyleCategory, Validators.compose([Validators.required, that.forbiddenSelectionValidator(that.fyleCategories)])],
          netsuiteAccount: [netsuiteAccount],
          netsuiteExpenseCategory: [netsuiteExpenseCategory]
        });
      }

      if (that.editMapping) {
        that.form.controls.fyleCategory.disable();
      }

      that.setupAutocompleteWatchers();
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.data.workspaceId;

    if (that.data.categoryMappingRow) {
      that.editMapping = true;
    }
    that.isLoading = true;
    that.settingsService.getGeneralSettings().subscribe((settings: GeneralSetting) => {
      that.generalSettings = settings;
      that.reset();
    });
  }
}
