import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-skip-export',
  templateUrl: './skip-export.component.html',
  styleUrls: ['./skip-export.component.scss']
})
export class SkipExportComponent implements OnInit {
  excludeForm: FormGroup;
  expenseFields: FormArray;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initFormGroups();
  }
  
  createExpenseField() {
    const that = this;

    const group = that.formBuilder.group({
      condition: ['',[Validators.required]], 
      operator: ['',[Validators.required]], 
      value: ['',[Validators.required]]
    });
    return group;
  }

  addExpenseField() {
    const that = this;
    that.expenseFields = that.excludeForm.get('expenseFields') as FormArray;
    that.expenseFields.push(that.createExpenseField());
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
}
