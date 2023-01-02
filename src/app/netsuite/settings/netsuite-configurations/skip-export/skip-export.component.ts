import { Component, OnChanges, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { event } from "cypress/types/jquery";

@Component({
  selector: "app-skip-export",
  templateUrl: "./skip-export.component.html",
  styleUrls: ["./skip-export.component.scss"],
})
export class SkipExportComponent implements OnInit {
  excludeForm: FormGroup;
  excludeForm1: FormGroup;
  condition: Boolean;
  operator_field_final: { id: number,label: string, value: string }[];
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.condition = false;
    this.initFormGroups();
    this.initFormGroups1();
  }

  checkCondition() {
    return this.condition;
  }

  addCondition() {
    this.condition = true;
    this.excludeForm1.enable();
  }

  remCondition() {
    this.condition = false;
    this.excludeForm1.disable();
  }

  onChange(event)
  {
    console.log(event['value']);
    this.operator_field_final = this.getConditionField(event['value']);
  }

  conditional_field = [
    {value: "EXPENSE CUSTOM FIELDS", label: "Expense Custom Fields" },
    {value: "REPORT NAME", label: "Report Number" },
    {value: "EMPLOYEE EMAIL", label: "Employee Email" },
    {value: "DATE OF SPEND", label: "Date of Spend" }
  ];

  operator_field = [
    {value: "EXPENSE CUSTOM FIELDS", label: "is empty" },
    {value: "EXPENSE CUSTOM FIELDS", label: "is not empty" },
    {value: "EXPENSE CUSTOM FIELDS", label: "is equal" },
    {value: "REPORT NAME", label: "Contains" },
    {value: "DATE OF SPEND", label: "is Before" },
    {value: "DATE OF SPEND", label: "is it on or before" },
  ];

  getConditionField(conditionField: string) {
    const operatorList = [];

    if (conditionField === 'EXPENSE CUSTOM FIELDS') {
      operatorList.push({
        label: 'is equal',
        value: 'EXPENSE CUSTOM FIELDS'
      });
      operatorList.push({
        label: 'is not empty',
        value: 'EXPENSE CUSTOM FIELDS'
      });
      operatorList.push({
        label: 'is empty',
        value: 'EXPENSE CUSTOM FIELDS'
      });
    }
    else if(conditionField === 'DATE OF SPEND'){
      operatorList.push({
        value: "DATE OF SPEND", label: "is Before"
      });
      operatorList.push({
        value: "DATE OF SPEND", label: "is it on or before" 
      });
    }
    return {
      'EXPENSE CUSTOM FIELDS': operatorList,
      'DATE OF SPEND': operatorList,
      'REPORT NAME': operatorList,
      'EMPLOYEE EMAIL': operatorList
    }[conditionField];
  }

  value_field = [
    { label: "ajdnwjnadw" },
    { label: "djanwjnadw" },
    { label: "wxdnwjnadw" },
    { label: "nvdnwjnadw" },
    { label: "npxnwjnadw" },
  ];
  
  initFormGroups() {
    this.excludeForm = new FormGroup({
      condition: new FormControl("", [Validators.required]),
      operator: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
    });
  }

  initFormGroups1() {
    this.excludeForm1 = new FormGroup({
      condition: new FormControl("", [Validators.required]),
      operator: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
    });
  }
}
