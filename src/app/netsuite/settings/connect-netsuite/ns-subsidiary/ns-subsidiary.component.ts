import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-ns-subsidiary',
  templateUrl: './ns-subsidiary.component.html',
  styleUrls: ['./ns-subsidiary.component.scss', '../../../netsuite.component.scss']
})
export class NsSubsidiaryComponent implements OnInit {

  subsidiaryForm: FormGroup;
  workspaceId: number;
  netsuiteSubsidiaries: any[]
  isLoading = true;
  subsidiaryIsValid = true;
  subsidiaryMappings: any;
  subsidiaryMappingDone = false;

  constructor(private formBuilder: FormBuilder, 
              private settingsService: SettingsService, 
              private mappingsService: MappingsService, 
              private route: ActivatedRoute, 
              private router: Router, 
              private matselect: MatSelectModule,
              private snackBar: MatSnackBar) {
                this.subsidiaryForm = this.formBuilder.group({
                  netsuiteSubsidiaries: new FormControl('')
              });
  }

  submit() {
    this.subsidiaryIsValid = false;

    const subsidiaryId = this.subsidiaryForm.value.netsuiteSubsidiaries;
    const netsuiteSubsidiary = this.netsuiteSubsidiaries.filter(filteredSubsidiary => filteredSubsidiary.destination_id === subsidiaryId)[0];

    if (subsidiaryId) {
      this.subsidiaryIsValid = true;
    }

    if (this.subsidiaryIsValid){
      this.settingsService.postSubsidiaryMappings(this.workspaceId, netsuiteSubsidiary.destination_id, netsuiteSubsidiary.value,).subscribe(response => {
        this.router.navigateByUrl(`workspaces/${this.workspaceId}/dashboard`);
      });
    }
  }

  getSubsidiaryMappings() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getSubsidiaryMappings().subscribe(subsidiaryMappings => {
      that.subsidiaryMappings = subsidiaryMappings;
      that.isLoading = false;
      that.subsidiaryMappingDone = true;
      that.subsidiaryForm = that.formBuilder.group({
        netsuiteSubsidiaries: [that.subsidiaryMappings ? that.subsidiaryMappings.internal_id : '']
      });
      that.subsidiaryForm.controls.netsuiteSubsidiaries.disable();
    }, error => {
      that.subsidiaryMappings = {};
      that.isLoading = false;
      that.subsidiaryForm = that.formBuilder.group({
        netsuiteSubsidiaries: [that.subsidiaryMappings ? that.subsidiaryMappings.internal_id : '']
      });
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;
    that.mappingsService.getNetSuiteSubsidiaries().subscribe(subsidiaries => {
      that.netsuiteSubsidiaries = subsidiaries;
    })
    that.getSubsidiaryMappings();
  }

}
