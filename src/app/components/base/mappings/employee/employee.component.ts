import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css', '../../base.component.css']
})
export class EmployeeComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleEmployees: any[];
  netsuiteVendors: any[];
  employeeMappings: any[];
  workspaceId: number;
  emailIsValid: boolean = true;
  vendorIsValid:boolean = true;
  employeeIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;
  generalMappings: any;
  filteredAccounts: any[];

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleEmployee: new FormControl(''),
      netsuiteVendor: new FormControl(''),
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'employeeMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  vendorFormatter = (netsuiteVendor) => netsuiteVendor.value;

  vendorSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.netsuiteVendors.filter(netsuiteVendor => new RegExp(term.toLowerCase(), 'g').test(netsuiteVendor.value.toLowerCase())))
  )
  
  emailFormatter = (fyleEmployee) => fyleEmployee.value;

  emailSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleEmployees.filter(fyleEmployee => new RegExp(term.toLowerCase(), 'g').test(fyleEmployee.value.toLowerCase())))
  )

  submit() {
    let fyleEmployee = this.form.value.fyleEmployee;
    let netsuiteVendor = this.form.value.netsuiteVendor;

    this.emailIsValid = false;
    this.vendorIsValid = false;
    
    if (fyleEmployee) {
      this.emailIsValid = true;
    }

    if (netsuiteVendor) {
      this.vendorIsValid = true;
    }

    let employeeMapping: any = [
      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'EMPLOYEE',
        destination_type: 'VENDOR',
        source_value: fyleEmployee.value,
        destination_value: netsuiteVendor.value
      })
    ];

    if (this.emailIsValid && this.vendorIsValid) {
      forkJoin(employeeMapping).subscribe(responses => {
        this.isLoading = true;
        this.clearModalValues();
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
          this.mappingsService.getFyleEmployees(this.workspaceId),
          this.mappingsService.getNetSuiteVendors(this.workspaceId),
          this.mappingsService.getMappings(this.workspaceId, 'EMPLOYEE'),
        ]
      ).subscribe(responses => {
        this.fyleEmployees = responses [0];
        this.netsuiteVendors = responses [1];
        this.employeeMappings = responses[2]['results'];
        this.isLoading = false;
      });
    });
  }

}
