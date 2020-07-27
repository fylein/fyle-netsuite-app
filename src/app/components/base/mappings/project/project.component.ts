import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { MappingsService } from '../mappings.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css', '../../base.component.css']
})
export class ProjectComponent implements OnInit {

  closeResult: string;
  form: FormGroup;
  fyleProjects: any[];
  netsuiteObjects: any[];
  projectMappings: any[];
  workspaceId: number;
  projectIsValid: boolean = true;
  objectIsValid:boolean = true;
  modalRef: NgbModalRef;
  isLoading: boolean = true;
  projectSetting: any;
  generalSettings: any = true;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private mappingsService: MappingsService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      fyleProject: new FormControl(''),
      netsuiteObject: new FormControl('')
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'projectMappingModal' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${reason}`;
    });
  }

  getProjectMappings() {
    this.mappingsService.getMappings(this.workspaceId, 'PROJECT').subscribe(projectMappings => {
      this.projectMappings = projectMappings.results;
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
  
  projectFormatter = (fyleProject) => fyleProject.value;

  projectSearch = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.fyleProjects.filter(fyleProject => new RegExp(term.toLowerCase(), 'g').test(fyleProject.value.toLowerCase())))
  )

  submit() {
    let fyleProject = this.form.value.fyleProject;
    let netsuiteObject = this.form.value.netsuiteObject;
    this.projectIsValid = false;
    this.objectIsValid = false;
    
    if (fyleProject) {
      this.projectIsValid = true;
    }

    if (netsuiteObject) {
      this.objectIsValid = true;
    }

    if (this.projectIsValid && this.objectIsValid) {
      this.isLoading = true;

      this.mappingsService.postMappings(this.workspaceId, {
        source_type: 'PROJECT',
        destination_type: this.projectSetting,
        source_value: fyleProject.value,
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
      this.projectSetting = this.generalSettings.project_field_mapping
      this.workspaceId = +params['workspace_id'];
      this.mappingsService.getFyleProjects(this.workspaceId).subscribe(projects => {
        this.fyleProjects = projects;
        this.getProjectMappings();
      });
      
      if (this.projectSetting === 'DEPARTMENT') { 
        this.mappingsService.getNetSuiteDepartments(this.workspaceId).subscribe(objects => {
          this.netsuiteObjects = objects;
        });
      } else if(this.projectSetting === 'LOCATION') {
        this.mappingsService.getNetSuiteLocations(this.workspaceId).subscribe(objects => {
          this.netsuiteObjects = objects;
        });
      }
    });
  }

}
