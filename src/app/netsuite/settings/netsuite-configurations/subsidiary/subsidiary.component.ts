import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {} from '../../../netsuite.component'

@Component({
  selector: 'app-subsidiary',
  templateUrl: './subsidiary.component.html',
  styleUrls: ['./subsidiary.component.scss', '../../../netsuite.component.scss']
})
export class SubsidiaryComponent implements OnInit {

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
      this.isLoading = true;
      this.settingsService.postSubsidiaryMappings(this.workspaceId, netsuiteSubsidiary.destination_id, netsuiteSubsidiary.value,).subscribe(response => {
        this.snackBar.open('Fetching Data from NetSuite. This might take a few minutes.', null, {
          duration: 200000000
        });
        this.mappingsService.postNetSuiteAccounts().subscribe(() => {
          this.isLoading = false;
          this.snackBar.open('Data Imported from NetSuite');
          this.router.navigateByUrl(`workspaces/${this.workspaceId}/dashboard`);
        });
      });
    }
  }

  getSubsidiaryMappings() {
    const that = this;
    that.mappingsService.getSubsidiaryMappings().subscribe(subsidiaryMappings => {
      that.subsidiaryMappings = subsidiaryMappings;
      that.subsidiaryMappingDone = true;
      that.mappingsService.getNetSuiteSubsidiaries().subscribe(subsidiaries => {
        that.netsuiteSubsidiaries = subsidiaries;
        this.isLoading = false;
      });
      that.subsidiaryForm = that.formBuilder.group({
        netsuiteSubsidiaries: [that.subsidiaryMappings ? that.subsidiaryMappings.internal_id : '']
      });
      that.subsidiaryForm.controls.netsuiteSubsidiaries.disable();
    }, error => {
      that.subsidiaryMappings = {};
      that.subsidiaryForm = that.formBuilder.group({
        netsuiteSubsidiaries: [that.subsidiaryMappings ? that.subsidiaryMappings.internal_id : '']
      });
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;
    that.mappingsService.postNetSuiteSubsidiaries().subscribe(subsidiaries => {
      that.netsuiteSubsidiaries = subsidiaries;
      this.isLoading = false;
    });
    that.getSubsidiaryMappings();
  }

}
