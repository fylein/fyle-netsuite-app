import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-simple-search-select',
  templateUrl: './simple-search-select.component.html',
  styleUrls: ['./simple-search-select.component.scss']
})
export class SimpleSearchSelectComponent implements OnInit {

  @Input() form: FormGroup;
  form2: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const that=this;
    that.form2 = that.formBuilder.group({
      searchOption: []
    });  }

}
