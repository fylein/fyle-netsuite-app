import { Component, Input, OnInit, Directive } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, NgControl } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { event } from 'cypress/types/jquery';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetSuiteComponent } from 'src/app/netsuite/netsuite.component';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { SubsidiaryMapping } from 'src/app/core/models/subsidiary-mapping.model';
import { MatDialog } from '@angular/material/dialog';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { SkipExport } from 'src/app/core/models/skip-export.model';
import { formatDate } from '@angular/common';
import { toArray } from 'cypress/types/lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-skip-export',
  templateUrl: './skip-export.component.html',
  styleUrls: ['./skip-export.component.scss'],
})
export class SkipExportComponent implements OnInit {
  isLoading: boolean;
  skipExportForm: FormGroup;
  showSecondFilter: boolean;
  showConditionButton: boolean;
  workspaceId: number;
  conditionFieldOptions = [];
  valueFieldOptions1 = [];
  valueFieldOptions2 = [];
  operatorFieldOptions1: { label: string; value: string }[];
  operatorFieldOptions2: { label: string; value: string }[];
  constructor(
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {}

  joinByOptions = [{ value: 'AND' }, { value: 'OR' }];

  addCondition() {
    this.showSecondFilter = true;
    this.showConditionButton = false;
  }

  remCondition() {
    this.skipExportForm.controls.condition2.reset();
    this.skipExportForm.controls.operator2.reset();
    this.skipExportForm.controls.value2.reset();
    this.skipExportForm.controls.join_by.reset();
    this.showSecondFilter = false;
    this.showConditionButton = true;
  }

  checkValidationCondition() {
    if (
      this.skipExportForm.get('condition1').valid &&
      this.skipExportForm.get('condition2').valid
    ) {
      if (
        this.skipExportForm.get('condition1').value.field_name ===
        this.skipExportForm.get('condition2').value.field_name
      ) {
        return true;
      }
    }
    return false;
  }

  checkValidation() {
    return this.showSecondFilter
      ? this.skipExportForm.valid &&
      this.skipExportForm.get('condition1').value !==
        this.skipExportForm.get('condition2').value
      : this.skipExportForm.get('condition1').valid &&
      this.skipExportForm.get('operator1').valid &&
      this.skipExportForm.get('value1').valid;
  }

  saveSkipExportFields() {
    const that = this;

    const valueField = this.skipExportForm.getRawValue();
    if (valueField.condition1.field_name === 'spent_at') {
      valueField.value1 = formatDate(
        valueField.value1,
        'yyyy-MM-dd hh:mm:ss+hh',
        'en'
      );
    }

    if (typeof valueField.value1 === 'string') {
      valueField.value1 = [valueField.value1];
    }

    if (valueField.condition1.is_custom === true) {
      if (valueField.operator1 === 'isnull') {
        valueField.value1 = ['True'];
      }
    }

    const payload = {
      condition: valueField.condition1.field_name,
      operator: valueField.operator1,
      values: valueField.value1,
      rank: 1,
      join_by: valueField.join_by ? valueField.join_by : null,
      is_custom: valueField.condition1.is_custom,
    };
    this.settingsService
      .postSkipExport(that.workspaceId, payload)
      .subscribe((skipExport: SkipExport) => {
        this.snackBar.open('Skip Export fields saved successfully');
      });
    if (valueField.condition2 && valueField.operator2 && valueField.value2) {
      if (valueField.condition2.field_name === 'spent_at') {
        valueField.value2 = formatDate(
          valueField.value2,
          'yyyy-MM-dd hh:mm:ss+hh',
          'en'
        );
      }
      if (typeof valueField.value2 === 'string') {
        valueField.value2 = [valueField.value2];
      }
      if (valueField.condition2.is_custom === true) {
        if (valueField.operator2 === 'isnull') {
          valueField.value2 = ['True'];
        }
      }
      const payload1 = {
        condition: valueField.condition2.field_name,
        operator: valueField.operator2,
        values: valueField.value2,
        rank: 2,
        join_by: null,
        is_custom: valueField.condition2.is_custom,
      };
      this.settingsService
        .postSkipExport(that.workspaceId, payload1)
        .subscribe((skipExport: SkipExport) => {});
    }
  }

  setOperatorFieldOptions(conditionField: string) {
    const operatorList = [];
    if (
      conditionField === 'claim_number' ||
      conditionField === 'employee_email' ||
      conditionField === 'report_title'
    ) {
      operatorList.push({
        value: 'iexact',
        label: 'is equal',
      });
    } else if (conditionField === 'spent_at') {
      operatorList.push({
        value: 'lt',
        label: 'is before',
      });
      operatorList.push({
        value: 'lte',
        label: 'is it on or before',
      });
    } else if (conditionField === 'report_title') {
      operatorList.push({
        value: 'icontains',
        label: 'contains',
      });
    }
    return {
      claim_number: operatorList,
      employee_email: operatorList,
      spent_at: operatorList,
      report_title: operatorList,
    }[conditionField];
  }

  conditionFieldWatcher1() {
    this.skipExportForm.controls.condition1.valueChanges.subscribe(
      (conditionSelected) => {
        this.skipExportForm.controls.value1.reset();
        if (conditionSelected.is_custom) {
          this.operatorFieldOptions1 = [
            {
              label: 'is equal',
              value: 'iexact',
            },
            {
              label: 'is empty',
              value: 'isnull',
            },
            {
              label: 'is not empty',
              value: 'isnull',
            },
          ];
        } else {
          this.operatorFieldOptions1 = this.setOperatorFieldOptions(
            conditionSelected.field_name
          );
        }
        this.setSkipExportValueField(
          conditionSelected.field_name,
          conditionSelected.is_custom
        );
      }
    );
  }

  conditionFieldWatcher2() {
    this.skipExportForm.controls.condition2.valueChanges.subscribe(
      (conditionSelected) => {
        if (conditionSelected) {
          this.skipExportForm.controls.value2.reset();
          if (conditionSelected.is_custom) {
            this.operatorFieldOptions2 = [
              {
                label: 'is equal',
                value: 'iexact',
              },
              {
                label: 'is empty',
                value: 'isnull',
              },
              {
                label: 'is not empty',
                value: 'isnull',
              },
            ];
          } else {
            this.operatorFieldOptions2 = this.setOperatorFieldOptions(
              conditionSelected.field_name
            );
          }
          this.setSkipExportValueField_1(
            conditionSelected.field_name,
            conditionSelected.is_custom
          );
        }
      }
    );
  }

  fieldWatcher() {
    this.conditionFieldWatcher1();
    this.conditionFieldWatcher2();
  }
  isNullOrNot(isNullOrNot = false) {
    if (isNullOrNot) {
      this.skipExportForm.get('value1').disable();
    } else {
      this.skipExportForm.get('value1').enable();
    }
  }

  setValueField(genericSelection: any) {
    this.mappingsService
      .getFyleExpenseAttributes(genericSelection, true)
      .subscribe((skipExportValue) => {
        this.valueFieldOptions1 = skipExportValue;
        this.isNullOrNot(false);
      });
  }

  setSkipExportValueField(genericSelection, isCustom) {
    if (isCustom) {
      this.skipExportForm.controls.operator1.valueChanges.subscribe(
        (operatorSelected) => {
          if (operatorSelected === 'isnull') {
            this.isNullOrNot(true);
            this.valueFieldOptions1 = [{ values: true }, Validators.required];
          } else if (operatorSelected === 'iexact') {
            this.isNullOrNot(false);
            this.setValueField(genericSelection);
          }
        }
      );
    } else {
      this.setValueField(genericSelection);
    }
  }

  isNullOrNot_1(isNullOrNot = false) {
    if (isNullOrNot) {
      this.skipExportForm.get('value2').disable();
    } else {
      this.skipExportForm.get('value2').enable();
    }
  }

  setValueField_1(genericSelection: any) {
    this.mappingsService
      .getFyleExpenseAttributes(genericSelection, true)
      .subscribe((skipExportValue) => {
        this.valueFieldOptions2 = skipExportValue;
        this.isNullOrNot_1(false);
      });
  }

  setSkipExportValueField_1(genericSelection, isCustom) {
    if (isCustom) {
      this.skipExportForm.controls.operator2.valueChanges.subscribe(
        (operatorSelected) => {
          if (operatorSelected === 'isnull') {
            this.isNullOrNot_1(true);
            this.valueFieldOptions2 = [{ values: true }, Validators.required];
          } else if (operatorSelected === 'iexact') {
            this.isNullOrNot_1(false);
            this.setValueField_1(genericSelection);
          }
        }
      );
    } else {
      this.setValueField_1(genericSelection);
    }
  }

  getCustomConditions() {
    this.mappingsService
      .getFyleCustomFields()
      .toPromise()
      .then((conditionValue) => {
        this.conditionFieldOptions = conditionValue;
      });
  }

  compareObjects(selectedOption: any, listedOption: any): boolean {
    if (JSON.stringify(selectedOption) === JSON.stringify(listedOption)) {
      return true;
    }
    return false;
  }

  clearSearchText(): void {
    const that = this;
    that.skipExportForm.controls.searchOption.patchValue(null);
  }

  getAllSettings() {
    forkJoin([
      this.mappingsService.getFyleCustomFields(),
      this.settingsService.getSkipExport(this.workspaceId),
    ]).subscribe(
      (responses) => {
        this.conditionFieldOptions = responses[0];
        const formOptions1 = responses[1].results[0];
        const formOptions2 = responses[1].results[1];
        this.operatorFieldOptions1 = this.setOperatorFieldOptions(
          formOptions1.condition
        );
        this.operatorFieldOptions2 = this.setOperatorFieldOptions(
          formOptions2.condition
        );
        this.setSkipExportValueField(
          formOptions1.condition,
          formOptions1.is_custom
        );

        const conditionArray = [];
        responses[1].results.forEach((element) => {
          const selectedConditionOption1 = {
            field_name: element.condition,
            type: [''],
            is_custom: element.is_custom,
          };

          const type = this.conditionFieldOptions.filter(
            (fieldOption) => fieldOption.field_name === element.condition
          )[0].type;
          selectedConditionOption1.type = type;
          conditionArray.push(selectedConditionOption1);
        });

        if (conditionArray.length > 1 && formOptions1.join_by != null) {
          this.addCondition();
        }

        this.skipExportForm = this.formBuilder.group({
          condition1: [
            conditionArray.length > 0 ? conditionArray[0] : '',
            [Validators.required],
          ],
          operator1: [formOptions1.operator, [Validators.required]],
          value1: [
            conditionArray[0].type === 'DATE'
              ? new Date(formOptions1.values[0])
              : formOptions1.values,
            [Validators.required],
          ],
          join_by: [formOptions1.join_by, [Validators.required]],
          condition2: [
            conditionArray.length > 1 && formOptions1.join_by != null
              ? conditionArray[1]
              : null,
            [Validators.required],
          ],
          operator2: [
            formOptions1.join_by != null ? formOptions2.operator : null,
            [Validators.required],
          ],
          value2: [
            conditionArray[1].type === 'DATE'
              ? new Date(formOptions2.values[0])
              : formOptions2.values,
            [Validators.required],
          ],
          searchOption: [''],
        });
        this.fieldWatcher();
        this.isLoading = false;
      },
      () => {
        this.getCustomConditions();
        this.skipExportForm = this.formBuilder.group({
          condition1: new FormControl('', [Validators.required]),
          operator1: new FormControl('', [Validators.required]),
          value1: new FormControl('', [Validators.required]),
          join_by: new FormControl('', [Validators.required]),
          condition2: new FormControl('', [Validators.required]),
          operator2: new FormControl('', [Validators.required]),
          value2: new FormControl('', [Validators.required]),
          searchOption: new FormControl(''),
        });
        this.fieldWatcher();
        this.isLoading = false;
      }
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.showSecondFilter = false;
    this.showConditionButton = true;
    this.workspaceId = this.route.snapshot.parent.parent.params.workspace_id;
    this.getAllSettings();
  }
}
