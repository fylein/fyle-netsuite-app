import { Component, Input, OnInit, Directive } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  NgControl,
} from '@angular/forms';
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

@Component({
  selector: 'app-skip-export',
  templateUrl: './skip-export.component.html',
  styleUrls: ['./skip-export.component.scss'],
})
export class SkipExportComponent implements OnInit {
  skipExportForm: FormGroup;
  formGroup: FormGroup;
  condition: boolean;
  addConditionButton: boolean;
  conditionType: string;
  workspaceId: number;
  operatorField: { label: string; value: string }[];
  operatorField1: { label: string; value: string }[];
  data: any;
  data_1: any;
  constructor(
    private fb: FormBuilder,
    private mappingsService: MappingsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.condition = false;
    this.addConditionButton = true;
    this.initFormGroups();
    this.getAllSettings();
    this.selectedOptions();
  }

  checkAddCondition() {
    return this.condition;
  }

  addCondition() {
    this.condition = true;
    this.addConditionButton = false;
  }

  remCondition() {
    this.skipExportForm.controls.condition_1.reset();
    this.condition = false;
    this.addConditionButton = true;
  }

  checkAddConditionButton() {
    return this.addConditionButton;
  }

  payload = {};
  saveSkipExportFields() {
    const that = this;

    const valueField = this.skipExportForm.getRawValue();
    if (valueField.condition.field_name === 'spent_at') {
      valueField.value = formatDate(
        valueField.value,
        'yyyy-MM-dd hh:mm:ss+hh',
        'en'
      );
    }
    if (valueField.condition_1.field_name === 'spent_at') {
      valueField.value_1 = formatDate(
        valueField.value_1,
        'yyyy-MM-dd hh:mm:ss+hh',
        'en'
      );
    }
    if (typeof valueField.value === 'string') {
      valueField.value = [valueField.value];
    }
    if (typeof valueField.value_1 === 'string') {
      valueField.value_1 = [valueField.value_1];
    }
    const payload = {
      condition: valueField.condition.field_name,
      operator: valueField.operator,
      values: valueField.value,
      rank: 1,
      join_by: valueField.join_by ? valueField.join_by : null,
      is_custom: valueField.condition.is_custom,
    };
    this.settingsService
      .postSkipExport(that.workspaceId, payload)
      .subscribe((skipExport: SkipExport) => {});
    if (valueField.condition_1 && valueField.operator_1 && valueField.value_1) {
      const payload_1 = {
        condition: valueField.condition_1.field_name,
        operator: valueField.operator_1,
        values: valueField.value_1,
        rank: 2,
        join_by: null,
        is_custom: valueField.condition.is_custom,
      };
      this.settingsService
        .postSkipExport(that.workspaceId, payload_1)
        .subscribe((skipExport: SkipExport) => {
          this.snackBar.open('Skip Export fields saved successfully');
        });
    }
  }

  setOperatorField(conditionField: string) {
    const operatorList = [];
    if (conditionField === 'claim_number') {
      operatorList.push({
        value: 'iexact',
        label: 'is equal',
      });
    } else if (conditionField === 'employee_email') {
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
      operatorList.push({
        value: 'iexact',
        label: 'is equal',
      });
    }
    return {
      claim_number: operatorList,
      employee_email: operatorList,
      spent_at: operatorList,
      report_title: operatorList,
    }[conditionField];
  }

  join_by = [{ value: 'AND' }, { value: 'OR' }];

  conditionFieldWatcher() {
    this.skipExportForm.controls.condition.valueChanges.subscribe(
      (conditionSelected) => {
        this.skipExportForm.controls.value.reset();
        if (conditionSelected.is_custom) {
          this.operatorField = [
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
          this.operatorField = this.setOperatorField(
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

  conditionFieldWatcher_1() {
    this.skipExportForm.controls.condition_1.valueChanges.subscribe(
      (conditionSelected) => {
        this.skipExportForm.controls.value_1.reset();
        if (conditionSelected.is_custom) {
          this.operatorField1 = [
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
          this.operatorField1 = this.setOperatorField(
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

  operatorFieldWatcher() {}

  fieldWatcher() {
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
    this.conditionFieldWatcher_1();
  }
  isNullOrNot(isNullOrNot = false) {
    if (isNullOrNot) {
      this.skipExportForm.get('value').disable();
    } else {
      this.skipExportForm.get('value').enable();
    }
  }
  value_field = [];
  setValueField(genericSelection: any) {
    this.mappingsService
      .getSkipExportValueField(genericSelection, true)
      .subscribe((skipExportValue) => {
        this.value_field = skipExportValue;
        this.isNullOrNot(false);
      });
  }
  setSkipExportValueField(genericSelection, isCustom) {
    if (isCustom) {
      this.skipExportForm.controls.operator.valueChanges.subscribe(
        (operatorSelected) => {
          if (operatorSelected === 'isnull') {
            this.isNullOrNot(true);
            this.value_field = [{ value: true }, Validators.required];
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

  value_field_1 = [];
  setSkipExportValueField_1(genericSelection, isCustom) {
    this.mappingsService
      .getSkipExportValueField(genericSelection, true)
      .subscribe((skipExportValue) => {
        this.value_field_1 = skipExportValue;
      });
  }

  condition_field = [];
  setConditionField(conditionValue) {
    this.condition_field = conditionValue;
  }

  getCustomConditions() {
    this.mappingsService
      .getSkipExportConditionField()
      .subscribe((conditionValue) => {
        this.setConditionField(conditionValue);
      });
  }
  compareObjects(selectedOption: any, listedOption: any): boolean {
    if (JSON.stringify(selectedOption) === JSON.stringify(listedOption)) {
      return true;
    }

    return false;
  }
  getAllSettings() {
    this.fieldWatcher();
    this.getCustomConditions();
  }

  selectedOptions() {
    this.settingsService.getSkipExport(2).subscribe((skipExport) => {
      this.data = skipExport.results[0];
      this.data_1 = skipExport.results[1];
      let ofType = '';
      if (this.data.condition === 'employee_email') {
        ofType = 'SELECT';
      } else if (this.data.condition === 'spent_at') {
        ofType = 'DATE';
      } else {
        ofType = 'TEXT';
      }
      let ofType_1 = '';
      if (this.data_1.condition === 'employee_email') {
        ofType_1 = 'SELECT';
      } else if (this.data_1.condition === 'spent_at') {
        ofType_1 = 'DATE';
      } else {
        ofType_1 = 'TEXT';
      }
      const actualOptionSelected = {
        field_name: this.data.condition,
        type: ofType,
        is_custom: this.data.is_custom,
      };

      const actualOptionSelected_1 = {
        field_name: this.data_1.condition,
        type: ofType_1,
        is_custom: this.data_1.is_custom,
      };

      this.skipExportForm.patchValue({
        condition: actualOptionSelected,
        operator: this.data.operator,
        value: this.data.values,
      });
      if (skipExport.count === 2) {
        this.addCondition();
        this.skipExportForm.patchValue({
          join_by: this.data.join_by,
          condition_1: actualOptionSelected_1,
          operator_1: this.data_1.operator,
          value_1: this.data_1.values,
        });
      }
    });
  }

  initFormGroups() {
    const actualOptionSelected = {
      field_name: 'claim_number',
      type: 'TEXT',
      is_custom: false,
    };
    this.skipExportForm = new FormGroup({
      condition: new FormControl('', [Validators.required]),
      operator: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      join_by: new FormControl('', [Validators.required]),
      condition_1: new FormControl('', [Validators.required]),
      operator_1: new FormControl('', [Validators.required]),
      value_1: new FormControl('', [Validators.required]),
    });
  }
}
