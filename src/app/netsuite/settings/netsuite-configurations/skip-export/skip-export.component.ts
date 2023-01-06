import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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

@Component({
  selector: "app-skip-export",
  templateUrl: "./skip-export.component.html",
  styleUrls: ["./skip-export.component.scss"],
})
export class SkipExportComponent implements OnInit {
  excludeForm: FormGroup;
  condition: Boolean;
  addConditionButton: Boolean;
  conditionType: string;
  operator_field: { label: string; value: string }[];
  value_field: { label: string; value: string }[];
  constructor(private formBuilder: FormBuilder, private mappingsService: MappingsService) {}

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
    this.excludeForm.controls.condition_1.reset();
    this.condition = false;
    this.addConditionButton = true;
  }

  checkAddConditionButton() {
    return this.addConditionButton;
  }

  setOperatorField(conditionField: string) {
    const operatorList = [];

    if (conditionField === "EXPENSE CUSTOM FIELDS") {
      operatorList.push({
        label: "is empty",
        value: "IS EMPTY EXPENSE CUSTOM FIELDS",
      });
      operatorList.push({
        label: "is not empty",
        value: "IS NOT EMPTY EXPENSE CUSTOM FIELDS",
      });
      operatorList.push({
        label: "is equal",
        value: "IS EQUAL EXPENSE CUSTOM FIELDS",
      });
    } else if (conditionField === "REPORT NUMBER") {
      operatorList.push({
        value: "IS EQUAL REPORT NUMBER",
        label: "is equal",
      });
    } else if (conditionField === "EMPLOYEE EMAIL") {
      operatorList.push({
        value: "IS EQUAL EMPLOYEE EMAIL",
        label: "is equal",
      });
    } else if (conditionField === "DATE OF SPEND") {
      operatorList.push({
        value: "IS BEFORE",
        label: "is before",
      });
      operatorList.push({
        value: "IS IT ON OR BEFORE",
        label: "is it on or before",
      });
    } else if (conditionField === "REPORT NAME") {
      operatorList.push({
        value: "CONTAINS REPORT NAME",
        label: "contains",
      });
      operatorList.push({
        value: "IS EQUAL REPORT NAME",
        label: "is equal",
      });
    }
    return {
      "EXPENSE CUSTOM FIELDS": operatorList,
      "REPORT NUMBER": operatorList,
      "EMPLOYEE EMAIL": operatorList,
      "DATE OF SPEND": operatorList,
      "REPORT NAME": operatorList,
    }[conditionField];
  }

  condition_type = [
    { value: "SELECT" },
    { value: "TEXT" },
    { value: "NUMBER" },
  ];

  and_or = [{ value: "AND" }, { value: "OR" }];

  setValueField(operator: string) {
    const valueList = [];
    if (
      operator === "IS EQUAL EXPENSE CUSTOM FIELDS" &&
      this.condition_type[0].value === "SELECT"
    ) {
      valueList.push({
        ofType: this.condition_type[0].value,
        label: "option 1",
        value: "OPTION 1",
      });
      valueList.push({
        ofType: this.condition_type[0].value,
        label: "option 2",
        value: "OPTION 2",
      });
    }
    return {
      "IS EQUAL EXPENSE CUSTOM FIELDS": valueList,
    }[operator];
  }

  conditionFieldWatcher() {
    this.excludeForm.controls.condition.valueChanges.subscribe(
      (conditionSelected) => {
        this.operator_field = this.setOperatorField(conditionSelected.value);
        this.getExpenseAttribute(conditionSelected.value);
      }
    );
  }

  operatorFieldWatcher() {
    this.excludeForm.controls.operator.valueChanges.subscribe(
      (operatorSelected) => {
        this.value_field = this.setValueField(operatorSelected);
      }
    );
  }

  fieldWatcher() {
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
  }

  //  Will come from API
  // to get this from api
  // /api/workspaces/fyle/expense_attributes/?attribute_type=EMPLOYEE&active=true
  employee_value = []
  getExpenseAttribute(genericSelection) {
    this.mappingsService.getFyleExpenseAttributes(genericSelection,true).subscribe((employeeValue)=>{
      // console.log(response,"backend expense data")
      this.employee_value = employeeValue
    })
  }

  conditional_field = [
    // {
    //   value: "EXPENSE CUSTOM FIELDS",
    //   label: "Expense Custom Fields",
    //   ofType: "SELECT",
    // },
    // { value: "REPORT NUMBER", label: "Report Number", ofType: "TEXT" },
    // { value: "EMPLOYEE EMAIL", label: "Employee Email", ofType: "SELECT" },
    // { value: "DATE OF SPEND", label: "Date of Spend", ofType: "DATE" },
    // { value: "REPORT NAME", label: "Report Name" },
  ];

  getCustomConditions(){
      this.mappingsService.getNetsuiteCustomFields("",true).subscribe((employeeValue)=>{
        console.log(employeeValue,"backend expense data")
        this.conditional_field = employeeValue
      })
    }
    
  getAllSettings() {
    this.fieldWatcher();
    this.getCustomConditions();
  }

  initFormGroups() {
    this.excludeForm = new FormGroup({
      condition: new FormControl("", [Validators.required]),
      operator: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
      andOr: new FormControl("", [Validators.required]),
      condition_1: new FormControl("", [Validators.required]),
      operator_1: new FormControl("", [Validators.required]),
      value_1: new FormControl("", [Validators.required]),
    });
    // console.log(this.excludeForm.value)
  }
}