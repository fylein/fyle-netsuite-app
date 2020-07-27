import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.css', '../../base.component.css']
})
export class CostCenterComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleCostCenters: any[];
  netsuiteObjects: any[];
  costCenterMappings: any[];
  workspaceId: number;
  costCenterIsValid: boolean = true;
  objectIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;
  costCenterSetting: any;
  generalSettings: any = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleCostCenter: new FormControl(''),
      netsuiteObject: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'costCenterMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getCostCenterMappings() {
    this.mappingsService.getMappings(this.workspaceId, 'COST_CENTER').subscribe(costCenterMappings => {
      this.costCenterMappings = costCenterMappings.results;
      this.isLoading = false;
    });
  }

  objectFormatter = (netsuiteObject) => netsuiteObject.value;

  objectSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.netsuiteObjects.filter(netsuiteObject => new RegExp(term.toLowerCase(), 'g').test(netsuiteObject.value.toLowerCase())))
  )
  
  costCenterFormatter = (fyleCostCenter) => fyleCostCenter.value;

  costCenterSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleCostCenters.filter(fyleCostCenter => new RegExp(term.toLowerCase(), 'g').test(fyleCostCenter.value.toLowerCase())))
  )

  submit() {
    let fyleCostCenter = this.form.value.fyleCostCenter;
    let netsuiteObject = this.form.value.netsuiteObject;
    this.costCenterIsValid = false;
    this.objectIsValid = false;
    
    if (fyleCostCenter) {
      this.costCenterIsValid = true;
    }

    if (netsuiteObject) {
      this.objectIsValid = true;
    }

    if (this.costCenterIsValid && this.objectIsValid) {
      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'COST_CENTER',
        destination_type: this.costCenterSetting,
        source_value: fyleCostCenter.value,
        destination_value: netsuiteObject.value
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
      this.generalSettings = JSON.parse(localStorage.getItem('generalSettings'))
      this.costCenterSetting = this.generalSettings.cost_center_field_mapping;
      this.workspaceId = +params['workspace_id'];
      this.mappingsService.getFyleCostCenters(this.workspaceId).subscribe(costCenters => {
        this.fyleCostCenters = costCenters;
        this.getCostCenterMappings();
      });

      if (this.costCenterSetting === 'CLASS') { 
        this.mappingsService.getNetSuiteClasses(this.workspaceId).subscribe(objects => {
          this.netsuiteObjects = objects;
        });
      } else if(this.costCenterSetting === 'DEPARTMENT') {
        this.mappingsService.getNetSuiteDepartments(this.workspaceId).subscribe(objects => {
          this.netsuiteObjects = objects;
        });
      }
    });
  }

}
