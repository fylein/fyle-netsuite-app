import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-skip-export',
  templateUrl: './skip-export.component.html',
  styleUrls: ['./skip-export.component.scss']
})
export class SkipExportComponent implements OnInit {
  excludeForm: FormGroup;
  excludeForm1: FormGroup;
  condition: Boolean;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.condition = false
    this.initFormGroups();
    this.initFormGroups1();
  }

  checkCondition()
  {
    return this.condition
  }

  addCondition() {
    this.condition = true
    this.excludeForm1.enable();
  }

  remCondition(){
    this.condition = false
    this.excludeForm1.disable();
  }

 conditional_field = [
      {id: 1, text: 'Expense Custom Fields'},
      {id: 2, text: 'Report Number'},
      {id: 3, text: 'Employee Email'},
      {id: 4, text: 'Date of Spend'},
      {id: 5, text: 'Report Name'}
  ];

 operator_field = [
    {id: 1, text: 'is empty'},
    {id: 2, text: 'is not empty'},
    {id: 3, text: 'is equal'},
    {id: 4, text: 'Contains'},
    {id: 5, text: 'is it on or before'}
];

value_field = [
  {id: 1, text: 'ajdnwjnadw'},
  {id: 2, text: 'djanwjnadw'},
  {id: 3, text: 'wxdnwjnadw'},
  {id: 4, text: 'nvdnwjnadw'},
  {id: 5, text: 'npxnwjnadw'}
];
  initFormGroups(){
    this.excludeForm = new FormGroup({
      condition: new FormControl('',[Validators.required]), 
      operator: new FormControl('',[Validators.required]), 
      value: new FormControl('',[Validators.required])
    });
  }

  initFormGroups1(){
    this.excludeForm1 = new FormGroup({
      condition: new FormControl('',[Validators.required]), 
      operator: new FormControl('',[Validators.required]), 
      value: new FormControl('',[Validators.required])
    });
  }
}
