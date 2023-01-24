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
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-skip-export',
  templateUrl: './skip-export.component.html',
  styleUrls: ['./skip-export.component.scss'],
})
export class SkipExportComponent implements OnInit {
  isLoading: boolean = true;
  isDisabledChip1: boolean = false;
  isDisabledChip2: boolean = false;
  skipExportForm: FormGroup;
  showAdditionalCondition: boolean = false;
  showAddButton: boolean = true;
  workspaceId: number;
  conditionFieldOptions: Array<{
    field_name: string;
    type: string;
    is_custom: boolean;
  }>;
  valueFieldOptions1 = [];
  valueFieldOptions2 = [];
  operatorFieldOptions1: { label: string; value: string }[];
  operatorFieldOptions2: { label: string; value: string }[];
  joinByOptions = [{ value: 'AND' }, { value: 'OR' }];
  constructor(
    private mappingsService: MappingsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {}
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  customOperatorOptions = [
    {
      label: 'is equal',
      value: 'iexact',
    },
    {
      label: 'is empty',
      value: 'is_empty',
    },
    {
      label: 'is not empty',
      value: 'is_not_empty',
    },
  ];
  valueOption1: any[] = [];
  valueOption2: any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  add1(addEvent1: MatChipInputEvent): void {
    const input = addEvent1.input;
    const value = addEvent1.value;

    if ((value || '').trim()) {
      this.valueOption1.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove1(chipValue: any): void {
    const index = this.valueOption1.indexOf(chipValue);

    if (index >= 0) {
      this.valueOption1.splice(index, 1);
    }
  }

  add2(addEvent2: MatChipInputEvent): void {
    const input = addEvent2.input;
    const value = addEvent2.value;

    if ((value || '').trim()) {
      this.valueOption2.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove2(chipValue: any): void {
    const index = this.valueOption2.indexOf(chipValue);

    if (index >= 0) {
      this.valueOption2.splice(index, 1);
    }
  }

  resetOptions() {
    this.skipExportForm.controls.join_by.reset();
    this.skipExportForm.controls.condition2.reset();
    this.skipExportForm.controls.operator2.reset();
    this.skipExportForm.controls.value2.reset();
  }

  resetFields(operator, value, conditionSelected, rank: number) {
    operator.reset();
    value.reset();
    if (rank === 1) {
      this.valueOption1 = [];
    } else if (rank === 2) {
      this.valueOption2 = [];
    }
    if (conditionSelected !== null) {
      if (conditionSelected.is_custom === true) {
        this.setCustomOperatorOptions(rank);
      } else if (conditionSelected.is_custom === false) {
        if (rank === 1) {
          this.operatorFieldOptions1 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        } else if (rank === 2) {
          this.operatorFieldOptions2 = this.setDefaultOperatorOptions(
            conditionSelected.field_name
          );
        }
      }
    }
  }

  updateAdditionalFilterVisibility(show) {
    this.showAdditionalCondition = show;
    this.showAddButton = !show;
  }

  remCondition() {
    this.showAdditionalCondition = false;
    this.showAddButton = true;
    this.resetOptions();
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
    if (this.showAdditionalCondition) {
      if (
        this.skipExportForm.get('condition1').valid &&
        this.skipExportForm.get('condition2').valid
      ) {
        if (
          this.skipExportForm.get('condition1').value.field_name !==
          this.skipExportForm.get('condition2').value.field_name
        ) {
          if (
            (this.skipExportForm.get('condition1').value.field_name ===
              'spent_at' &&
              this.skipExportForm.get('value1').valid) ||
            this.valueOption1.length !== 0 ||
            this.skipExportForm.get('operator1').value === 'is_empty' ||
            this.skipExportForm.get('operator1').value === 'is_not_empty'
          ) {
            if (
              (this.skipExportForm.get('condition2').value.field_name ===
                'spent_at' &&
                this.skipExportForm.get('value2').valid) ||
              this.valueOption2.length !== 0 ||
              this.skipExportForm.get('operator2').value === 'is_empty' ||
              this.skipExportForm.get('operator2').value === 'is_not_empty'
            ) {
              return true;
            }
          }
        }
      }
    } else if (
      this.skipExportForm.get('condition1').valid &&
      this.skipExportForm.get('operator1').valid
    ) {
      if (this.valueOption1.length !== 0) {
        return true;
      }
      if (
        this.skipExportForm.get('condition1').value.field_name === 'spent_at' &&
        this.skipExportForm.get('value1').valid
      ) {
        return true;
      }
      if (
        this.skipExportForm.get('operator1').value === 'is_empty' ||
        this.skipExportForm.get('operator1').value === 'is_not_empty'
      ) {
        return true;
      }
    }
    return false;
  }

  saveSkipExportFields() {
    const that = this;
    const valueField = this.skipExportForm.getRawValue();
    if (valueField.condition1.is_custom === true) {
      if (valueField.operator1 === 'is_empty') {
        valueField.value1 = ['True'];
        valueField.operator1 = 'isnull';
      } else if (valueField.operator1 === 'is_not_empty') {
        valueField.value1 = ['False'];
        valueField.operator1 = 'isnull';
      }
    }

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
    const payload1 = {
      condition: valueField.condition1.field_name,
      operator: valueField.operator1,
      values: valueField.condition1.type === 'DATE' || valueField.operator1 === 'isnull' ? valueField.value1 : this.valueOption1,
      rank: 1,
      join_by: valueField.join_by ? valueField.join_by : null,
      is_custom: valueField.condition1.is_custom,
      custom_field_type: valueField.condition1.is_custom ? valueField.condition1.type : null,
    };
    this.settingsService
      .postSkipExport(that.workspaceId, payload1)
      .subscribe((skipExport: SkipExport) => {
        if (valueField.condition2 && valueField.operator2) {
          if (valueField.condition2.field_name === 'spent_at') {
            valueField.value2 = formatDate(
              valueField.value2,
              'yyyy-MM-dd hh:mm:ss+hh',
              'en'
            );
          }

          if (valueField.condition2.is_custom === true) {
            if (valueField.operator2 === 'is_empty') {
              valueField.value2 = ['True'];
              valueField.operator2 = 'isnull';
            } else if (valueField.operator2 === 'is_not_empty') {
              valueField.value2 = ['False'];
              valueField.operator2 = 'isnull';
            }
          }

          if (typeof valueField.value2 === 'string') {
            valueField.value2 = [valueField.value2];
          }
          const payload2 = {
            condition: valueField.condition2.field_name,
            operator: valueField.operator2,
            values: valueField.condition2.type === 'DATE' || valueField.operator2 === 'isnull' ? valueField.value2 : this.valueOption2,
            rank: 2,
            join_by: null,
            is_custom: valueField.condition2.is_custom,
            custom_field_type: valueField.condition2.is_custom ? valueField.condition2.type : null,
          };
          this.settingsService
            .postSkipExport(that.workspaceId, payload2)
            .subscribe((skipExport: SkipExport) => {});
        }
        this.snackBar.open('Skip Export fields saved successfully');
      });
  }

  setDefaultOperatorOptions(conditionField: string) {
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
    return operatorList;
  }

  setCustomOperatorOptions(rank: number) {
    if (rank === 1) {
      this.operatorFieldOptions1 = this.customOperatorOptions;
    } else if (rank === 2) {
      this.operatorFieldOptions2 = this.customOperatorOptions;
    }
  }

  conditionFieldWatcher() {
    this.skipExportForm.controls.condition1.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator1,
          this.skipExportForm.controls.value1,
          conditionSelected,
          1
        );
      }
    );

    this.skipExportForm.controls.condition2.valueChanges.subscribe(
      (conditionSelected) => {
        this.resetFields(
          this.skipExportForm.controls.operator2,
          this.skipExportForm.controls.value2,
          conditionSelected,
          2
        );
      }
    );
  }

  operatorFieldWatcher() {
    this.skipExportForm.controls.operator1.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption1 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip1 = true;
        } else {
          this.isDisabledChip1 = false;
        }
      }
    );

    this.skipExportForm.controls.operator2.valueChanges.subscribe(
      (operatorSelected) => {
        this.valueOption2 = [];
        if (
          operatorSelected === 'is_empty' ||
          operatorSelected === 'is_not_empty'
        ) {
          this.isDisabledChip2 = true;
        } else {
          this.isDisabledChip2 = false;
        }
      }
    );
  }

  fieldWatcher() {
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
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

  getAllSettings() {
    forkJoin([
      this.mappingsService.getFyleCustomFields(),
      this.settingsService.getSkipExport(this.workspaceId),
    ]).subscribe((responses) => {
      this.conditionFieldOptions = responses[0];
      const conditionArray = [];
      responses[1].results.forEach((element) => {
        const selectedConditionOption = {
          field_name: element.condition,
          type: '',
          is_custom: element.is_custom,
        };
        const type = this.conditionFieldOptions.filter(
          (fieldOption) => fieldOption.field_name === element.condition
        )[0].type;
        selectedConditionOption.type = type;
        conditionArray.push(selectedConditionOption);
      });

      if (conditionArray.length) {
        if (responses[1].results[0].is_custom) {
          this.setCustomOperatorOptions(responses[1].results[0].rank);
        } else {
          this.operatorFieldOptions1 = this.setDefaultOperatorOptions(
            responses[1].results[0].condition
          );
        }
        if (responses[1].results[0].join_by !== null) {
          this.updateAdditionalFilterVisibility(true);
          if (responses[1].results[1].is_custom) {
            this.setCustomOperatorOptions(responses[1].results[1].rank);
          } else {
            this.operatorFieldOptions2 = this.setDefaultOperatorOptions(
              responses[1].results[1].condition
            );
          }
        }
      }

      let selectedOperator1;
      if (responses[1].results[0].operator === 'isnull') {
        if (responses[1].results[0].values[0] === 'True') {
          selectedOperator1 = 'is_empty';
        } else {
          selectedOperator1 = 'is_not_empty';
        }
      } else {
        selectedOperator1 = responses[1].results[0].operator;
      }

      let selectedOperator2;
      if (responses[1].results[1].operator === 'isnull') {
        if (responses[1].results[1].values[0] === 'True') {
          selectedOperator2 = 'is_empty';
        } else {
          selectedOperator2 = 'is_not_empty';
        }
      } else {
        selectedOperator2 = responses[1].results[1].operator;
      }

      this.skipExportForm = this.formBuilder.group({
        condition1: [
          conditionArray.length > 0 ? conditionArray[0] : '',
          [Validators.required],
        ],
        operator1: [selectedOperator1, [Validators.required]],
        value1: [
          selectedOperator1 === 'is_empty' ||
          selectedOperator1 === 'is_not_empty'
            ? (this.isDisabledChip1 = true)
            : conditionArray[0].type === 'DATE'
            ? new Date(responses[1].results[0].values[0])
            : (this.valueOption1 = responses[1].results[0].values),
          [Validators.required],
        ],
        customFieldType1: [responses[1].results[0].custom_field_type],

        join_by: [
          responses[1].results[0].join_by !== null
            ? responses[1].results[0].join_by
            : '',
          [Validators.required],
        ],

        condition2: [
          responses[1].results[0].join_by !== null ? conditionArray[1] : '',
          [Validators.required],
        ],
        operator2: [
          responses[1].results[0].join_by !== null ? selectedOperator2 : '',
          [Validators.required],
        ],
        value2: [
          responses[1].results[0].join_by !== null
            ? selectedOperator2 === 'is_empty' ||
              selectedOperator2 === 'is_not_empty'
              ? (this.isDisabledChip2 = true)
              : conditionArray[1].type === 'DATE'
              ? new Date(responses[1].results[1].values[0])
              : (this.valueOption2 = responses[1].results[1].values)
            : '',
          [Validators.required],
        ],
        customFieldType2:
          responses[1].results[0].join_by !== null
            ? [responses[1].results[1].custom_field_type]
            : [''],
      });
      this.fieldWatcher();
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.workspaceId = this.route.snapshot.parent.parent.params.workspace_id;
    this.getAllSettings();
  }
}
