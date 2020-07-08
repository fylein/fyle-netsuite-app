import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css', '../../base.component.css']
})
export class CategoryComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleCategories: any[];
  netsuiteAccounts: any[];
  categoryMappings: any[];
  workspaceId: number;
  categoryIsValid: boolean = true;
  accountIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleCategory: new FormControl(''),
      netsuiteAccount: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'categoryMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getCategoryMappings() {
    this.mappingsService.getFyleCategories(this.workspaceId).subscribe(categoryMappings => {
      this.categoryMappings = categoryMappings.results;
      this.isLoading = false;
    });
  }

  accountFormatter = (netsuiteAccount) => netsuiteAccount.value;

  accountSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 1),
    map(term => this.netsuiteAccounts.filter(netsuiteAccount => new RegExp(term.toLowerCase(), 'g').test(netsuiteAccount.value.toLowerCase())))
  )
  
  categoryFormatter = (fyleCategory) => fyleCategory.value;

  categorySearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 1),
    map(term => this.fyleCategories.filter(fyleCategory => new RegExp(term.toLowerCase(), 'g').test(fyleCategory.value.toLowerCase())))
  )

  submit() {
    let fyleCategory = this.form.value.fyleCategory;
    let netsuiteAccount = this.form.value.netsuiteAccount;
    this.categoryIsValid = false;
    this.accountIsValid = false;
    
    if (fyleCategory) {
      this.categoryIsValid = true;
    }

    if (netsuiteAccount) {
      this.accountIsValid = true;
    }

    if (this.categoryIsValid && this.accountIsValid) {
      this.isLoading = true;
      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'CATEGORY',
        destination_type: 'ACCOUNT',
        source_value: fyleCategory.value,
        destination_value: netsuiteAccount.value
      }).subscribe(response => {
        this.clearModalValues();
        this.isLoading = true;
        this.ngOnInit();
      });
    }
  }

  clearModalValues() {
    this.form.reset();
    this.modalRef.close();
  }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.workspaceId = +params['workspace_id'];

      forkJoin(
        [
          this.mappingsService.getFyleCategories(this.workspaceId),
          this.mappingsService.getExpenseAccounts(this.workspaceId),
          this.mappingsService.getMappings(this.workspaceId, 'CATEGORY')
        ]
      ).subscribe(responses => {
        this.fyleCategories = responses [0];
        this.netsuiteAccounts = responses [1];
        this.categoryMappings = responses[2]['results'];
        
        this.isLoading = false;
      });
    });
  }

}
