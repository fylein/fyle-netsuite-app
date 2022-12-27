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
  }

  remCondition(){
    this.condition = false
  }

 sample_array = [
      {id: 1, text: 'isEmpty'},
      {id: 2, text: 'isNotEmpty'},
      {id: 3, text: 'isEqual'}
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
