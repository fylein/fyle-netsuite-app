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
        this.skipExportForm.get('condition1').value ===
        this.skipExportForm.get('condition2').value
      ) {
        return true;
      }
    }
    return false;
  }

  checkValidation() {
    return !this.showSecondFilter
      ? this.skipExportForm.get('condition1').valid &&
          this.skipExportForm.get('operator1').valid &&
          this.skipExportForm.get('value1').valid
      : this.skipExportForm.valid &&
          this.skipExportForm.get('condition1').value !==
            this.skipExportForm.get('condition2').value;
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
    this.mappingsService.getFyleCustomFields().subscribe((conditionValue) => {
      this.conditionFieldOptions = conditionValue;
    });
  }

  compareObjects(selectedOption: any, listedOption: any): boolean {
    if (JSON.stringify(selectedOption) === JSON.stringify(listedOption)) {
      return true;
    }
    return false;
  }

  selectedOptions() {
    this.settingsService
      .getSkipExport(this.workspaceId)
      .subscribe((skipExport) => {
        const data = skipExport.results[0];
        const data1 = skipExport.results[1];
        // TODO
        let ofType = '';
        if (data.condition === 'employee_email') {
          ofType = 'SELECT';
        } else if (data.condition === 'spent_at') {
          ofType = 'DATE';
        } else {
          ofType = 'TEXT';
        }
        let ofType1 = '';
        if (data1.condition === 'employee_email') {
          ofType1 = 'SELECT';
        } else if (data1.condition === 'spent_at') {
          ofType1 = 'DATE';
        } else {
          ofType1 = 'TEXT';
        }
        const actualOptionSelected = {
          field_name: data.condition,
          type: ofType,
          is_custom: data.is_custom,
        };
        const actualOptionSelected1 = {
          field_name: data1.condition,
          type: ofType1,
          is_custom: data1.is_custom,
        };

        this.skipExportForm.patchValue({
          condition1: actualOptionSelected,
          operator1: data.operator,
          value1: data.values,
        });

        if (skipExport.count === 2) {
          this.addCondition();
          this.skipExportForm.patchValue({
            join_by: data.join_by,
            condition2: actualOptionSelected1,
            operator2: data1.operator,
            value2: data1.values,
          });
        }
      });
  }

  clearSearchText(): void {
    const that = this;
    that.skipExportForm.controls.searchOption.patchValue(null);
  }

  initFormGroups() {
    this.skipExportForm = new FormGroup({
      condition1: new FormControl('', [Validators.required]),
      operator1: new FormControl('', [Validators.required]),
      value1: new FormControl('', [Validators.required]),
      join_by: new FormControl('', [Validators.required]),
      condition2: new FormControl('', [Validators.required]),
      operator2: new FormControl('', [Validators.required]),
      value2: new FormControl('', [Validators.required]),
      searchOption: new FormControl(''),
    });
  }

  getAllSettings() {
    this.fieldWatcher();
    this.getCustomConditions();
    this.selectedOptions();
  }

  ngOnInit() {
    this.initFormGroups();
    this.showSecondFilter = false;
    this.showConditionButton = true;
    this.workspaceId = this.route.snapshot.parent.parent.params.workspace_id;
    this.getAllSettings();
  }
}
