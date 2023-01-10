import { Component, Input, OnInit, Directive } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, NgControl } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { event } from "cypress/types/jquery";
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetSuiteComponent } from 'src/app/netsuite/netsuite.component';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { SubsidiaryMapping } from 'src/app/core/models/subsidiary-mapping.model';
import { MatDialog } from '@angular/material/dialog';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { MappingsService } from "src/app/core/services/mappings.service";
import { SkipExport } from "src/app/core/models/skip-export.model";

// @Directive({
//   selector: '[enableDisable]'
// })
// export class EnableDisableDirective {
//   @Input() set enableDisable(action: string) {
//     this.ngControl.control[action]();
//   }
//   constructor(private ngControl: NgControl) {
//   }
// }

@Component({
  selector: "app-skip-export",
  templateUrl: "./skip-export.component.html",
  styleUrls: ["./skip-export.component.scss"],
})
export class SkipExportComponent implements OnInit {
  skipExportForm: FormGroup;
  condition: Boolean;
  addConditionButton: Boolean;
  conditionType: string;
  workspaceId: number;
  operator_field: { label: string; value: string }[];
  operator_field_1: { label: string; value: string }[];
  // value_field_1: { label: string; value: string }[];
  // value_field: { label: string; value: string }[];
  constructor(
    private formBuilder: FormBuilder,
    private mappingsService: MappingsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.condition = false;
    this.addConditionButton = true;
    this.initFormGroups();
    this.getAllSettings();
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

  // {
  //   "condition" : "employee_email",
  //   "operator" : "in",
  //   "values" : [
  //     "ashwinnnnn.t@fyle.in",
  //     "admin1@fyleforleaf.in"
  //   ],
  //   "rank" : 1,
  //   "join_by" : null,
  //   "is_custom" : False,
  // },

  payload = {};
  saveSkipExportFields() {
    const that = this;

    const valueField = this.skipExportForm.getRawValue();
    // console.log("hello",valueField)

    // console.log(valueField.condition)

    //Actual first payload
    const payload = {
      condition: valueField.condition.field_name,
      operator: valueField.operator,
      value: valueField.value,
      rank: 1,
      join_by: valueField.join_by ? valueField.join_by.value : null,
      is_custom: valueField.condition.is_custom,
    };

    this.settingsService
      .postSkipExport(that.workspaceId, payload)
      .subscribe((skipExport: SkipExport) => {
        console.log("first payload send", payload);
      });
    // to handle isempty and is not empty****** input field should be disabled bruh
    // check the date
    // get call to assign value to form controller, saved setting will be displayed in the
    // is loading, initially it will be true, once api call is done it will change it to false,
    if (valueField.condition_1 && valueField.operator_1 && valueField.value_1) {
      const payload_1 = {
        condition: valueField.condition_1.field_name,
        operator: valueField.operator_1,
        value: valueField.value_1,
        rank: 2,
        join_by: null,
        is_custom: valueField.condition.is_custom,
      };
      this.settingsService
        .postSkipExport(that.workspaceId, payload_1)
        .subscribe((skipExport: SkipExport) => {
          console.log("second payload send", payload_1);
          this.snackBar.open("Skip Export fields saved successfully");
        });
    }
  }

  setOperatorField(conditionField: string) {
    const operatorList = [];
    // console.log(conditionField)
    if (conditionField === "report_id") {
      operatorList.push({
        value: "iexact",
        label: "is equal",
      });
    } else if (conditionField === "employee_email") {
      operatorList.push({
        value: "iexact",
        label: "is equal",
      });
    } else if (conditionField === "spent_at") {
      operatorList.push({
        value: "lt",
        label: "is before",
      });
      operatorList.push({
        value: "lte",
        label: "is it on or before",
      });
    } else if (conditionField === "report_title") {
      operatorList.push({
        value: "icontains",
        label: "contains",
      });
      operatorList.push({
        value: "iexact",
        label: "is equal",
      });
    }
    return {
      report_title: operatorList,
      employee_email: operatorList,
      spent_at: operatorList,
      report_id: operatorList,
    }[conditionField];
  }

  join_by = [{ value: "AND" }, { value: "OR" }];

  // condition_type = [
  //   { value: "SELECT" },
  //   { value: "TEXT" },
  //   { value: "NUMBER" },
  // ];

  conditionFieldWatcher() {
    this.skipExportForm.controls.condition.valueChanges.subscribe(
      (conditionSelected) => {
        console.log(conditionSelected);
        this.skipExportForm.controls.value.reset();
        if (conditionSelected.is_custom) {
          this.operator_field = [
            {
              label: "is equal",
              value: "iexact",
            },
            {
              label: "is empty",
              value: "isnull",
            },
            {
              label: "is not empty",
              value: "isnull",
            },
          ];
        } else {
          this.operator_field = this.setOperatorField(
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
        // console.log(conditionSelected.label);
        // this.skipExportForm.controls.operator_1.reset();
        // console.log(conditionSelected);
        this.skipExportForm.controls.value_1.reset();
        if (conditionSelected.is_custom) {
          this.operator_field_1 = [
            {
              label: "is equal",
              value: "iexact",
            },
            {
              label: "is empty",
              value: "isnull",
            },
            {
              label: "is not empty",
              value: "isnull",
            },
          ];
        } else {
          this.operator_field_1 = this.setOperatorField(
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
      this.skipExportForm.get("value").disable();
    } else {
      this.skipExportForm.get("value").enable();
    }
  }
  value_field = [];
  setValueField(genericSelection) {
    this.mappingsService
      .getSkipExportValueField(genericSelection, true)
      .subscribe((skipExportValue) => {
        // console.log(skipExportValue,"array")
        this.isNullOrNot(false);
        this.value_field = skipExportValue;
      });
  }
  setSkipExportValueField(genericSelection, isCustom) {
    if (isCustom) {
      this.skipExportForm.controls.operator.valueChanges.subscribe(
        (operatorSelected) => {
          console.log(operatorSelected);
          console.log(isCustom);
          if (operatorSelected == "isnull") {
            this.isNullOrNot(true);
            this.value_field = [{ value: true }, Validators.required];
          } else if (operatorSelected == "iexact") {
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
        // console.log(skipExportValue,"array")
        this.value_field_1 = skipExportValue;
      });
  }

  condition_field = [];
  //remove this this is snake case
  setConditionField(conditionValue) {
    // console.log(conditionValue)
    this.condition_field = conditionValue;
  }

  getCustomConditions() {
    this.mappingsService
      .getSkipExportConditionField()
      .subscribe((conditionValue) => {
        // console.log(conditionValue,"conditon field")
        this.setConditionField(conditionValue);
      });
  }

  getAllSettings() {
    this.fieldWatcher();
    this.getCustomConditions();
  }

  initFormGroups() {
    this.skipExportForm = new FormGroup({
      condition: new FormControl("", [Validators.required]),
      operator: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
      join_by: new FormControl("", [Validators.required]),
      condition_1: new FormControl("", [Validators.required]),
      operator_1: new FormControl("", [Validators.required]),
      value_1: new FormControl("", [Validators.required]),
    });
    // console.log(this.skipExportForm.value)
  }
}
