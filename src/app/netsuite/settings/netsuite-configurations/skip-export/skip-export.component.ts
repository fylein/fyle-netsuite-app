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
  condition: Boolean;
  operator_field: { label: string, value: string }[];
  value_field: { label: string, value: string }[];
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.condition = false;
    this.initFormGroups();
    this.getAllSettings();
  }

  checkCondition() {
    return this.condition;
  }

  addCondition() {
    this.condition = true;
    // this.excludeForm1.enable();
  }

  remCondition() {
    this.condition = false;
    // this.excludeForm1.disable();
    this.excludeForm.controls.condition_1.reset();
  }

  setOperatorField(conditionField: string) {
    const operatorList = [];

    if (conditionField === 'EXPENSE CUSTOM FIELDS') {
      operatorList.push({
        label: 'is empty',
        value: 'IS EMPTY EXPENSE CUSTOM FIELDS'
      });
      operatorList.push({
        label: 'is not empty',
        value: 'IS NOT EMPTY EXPENSE CUSTOM FIELDS'
      });
      operatorList.push({
        label: 'is equal',
        value: 'IS EQUAL EXPENSE CUSTOM FIELDS'
      });
    }
    else if(conditionField === 'REPORT NUMBER'){
      operatorList.push({
        value: "IS EQUAL REPORT NUMBER", label: "is equal"
      });
    }
    else if(conditionField === 'EMPLOYEE EMAIL'){
      operatorList.push({
        value: "IS EQUAL EMPLOYEE EMAIL", label: "is equal"
      });
    }
    else if(conditionField === 'DATE OF SPEND'){
      operatorList.push({
        value: "IS BEFORE", label: "is before"
      });
      operatorList.push({
        value: "IS IT ON OR BEFORE", label: "is it on or before" 
      });
    }
    else if(conditionField === 'REPORT NAME'){
      operatorList.push({
        value: "CONTAINS REPORT NAME", label: "contains"
      });
      operatorList.push({
        value: "IS EQUAL REPORT NAME", label: "is equal" 
      });
    }
    return {
      'EXPENSE CUSTOM FIELDS': operatorList,
      'REPORT NUMBER': operatorList,
      'EMPLOYEE EMAIL': operatorList,
      'DATE OF SPEND': operatorList,
      'REPORT NAME': operatorList
    }[conditionField];
  }

  condition_type = [
    {id: 1, value: 'SELECT'},
    {id: 2, value: 'TEXT'},
    {id: 3, value: 'NUMBER'}
];

  setValueField(operator: string)
  {
    const valueList = [];
    // if (operator === 'EXPENSE CUSTOM FIELDS') {
    //   valueList.push({
    //     ofType: this.condition_type[0].value,
    //     label: 'is empty',
    //     value: 'IS EMPTY EXPENSE CUSTOM FIELDS'
    //   });
    //   valueList.push({
    //     label: 'is not empty',
    //     value: 'IS NOT EMPTY EXPENSE CUSTOM FIELDS'
    //   });
    //   valueList.push({
    //     label: 'is equal',
    //     value: 'IS EQUAL EXPENSE CUSTOM FIELDS'
    //   });
    // }
    return {

    }[operator];
  }

  conditionFieldWatcher(){
    this.excludeForm.controls.condition.valueChanges.subscribe((conditionSelected) => {
      this.operator_field=this.setOperatorField(conditionSelected);
    });
  }

  operatorFieldWatcher(){
    this.excludeForm.controls.operator.valueChanges.subscribe((operatorSelected) => {
      this.value_field=this.setValueField(operatorSelected);
    });
  }

  fieldWatcher(){
    this.conditionFieldWatcher();
    this.operatorFieldWatcher();
  }

  conditional_field = [
    {value: "EXPENSE CUSTOM FIELDS", label: "Expense Custom Fields", ofType: "SELECT" },
    {value: "REPORT NUMBER", label: "Report Number" },
    {value: "EMPLOYEE EMAIL", label: "Employee Email" },
    {value: "DATE OF SPEND", label: "Date of Spend" },
    {value: "REPORT NAME", label: "Report Name" }
  ];
  
  getAllSettings(){
    this.fieldWatcher();
  }

  initFormGroups() {
    this.excludeForm = new FormGroup({
      condition: new FormControl("", [Validators.required]),
      operator: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
      condition_1: new FormControl("", [Validators.required]),
      operator_1: new FormControl("", [Validators.required]),
      value_1: new FormControl("", [Validators.required])
    })
  }
}
