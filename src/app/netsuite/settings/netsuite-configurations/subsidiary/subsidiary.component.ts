import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MappingDestination } from 'src/app/core/models/mapping-destination.model';
import { SubsidiaryMapping } from 'src/app/core/models/subsidiary-mapping.model';

@Component({
  selector: 'app-subsidiary',
  templateUrl: './subsidiary.component.html',
  styleUrls: ['./subsidiary.component.scss', '../../../netsuite.component.scss']
})
export class SubsidiaryComponent implements OnInit {

  subsidiaryForm: FormGroup;
  workspaceId: number;
  netsuiteSubsidiaries: MappingDestination[];
  isLoading: boolean;
  subsidiaryMappings: SubsidiaryMapping;
  subsidiaryMappingDone = false;

  constructor(private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private mappingsService: MappingsService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {}

  submit() {
    const that = this;

    if (that.subsidiaryForm.valid) {
      const subsidiaryId = this.subsidiaryForm.value.netsuiteSubsidiaries;
      const netsuiteSubsidiary = this.netsuiteSubsidiaries.filter(filteredSubsidiary => filteredSubsidiary.destination_id === subsidiaryId)[0];

      this.isLoading = true;
      this.settingsService.postSubsidiaryMappings(this.workspaceId, netsuiteSubsidiary.destination_id, netsuiteSubsidiary.value).subscribe(response => {
        this.router.navigateByUrl(`workspaces/${this.workspaceId}/dashboard`);
      });
    } else {
      that.snackBar.open('Please fill up the form with valid values');
      that.subsidiaryForm.markAllAsTouched();
    }
  }

  getSubsidiaryMappings() {
    const that = this;
    that.mappingsService.getSubsidiaryMappings().subscribe(subsidiaryMappings => {
      that.isLoading = false;
      that.subsidiaryMappings = subsidiaryMappings;
      that.subsidiaryMappingDone = true;
      that.subsidiaryForm = that.formBuilder.group({
        netsuiteSubsidiaries: [that.subsidiaryMappings ? that.subsidiaryMappings.internal_id : '']
      });
      that.subsidiaryForm.controls.netsuiteSubsidiaries.disable();
    }, () => {
      that.isLoading = false;
      that.subsidiaryForm = that.formBuilder.group({
        netsuiteSubsidiaries: ['', Validators.required]
      });
    });
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;
    that.mappingsService.getNetsuiteExpenseCustomFields('SUBSIDIARY').subscribe((subsidiaries) => {
      that.netsuiteSubsidiaries = subsidiaries;
      that.getSubsidiaryMappings();
    });
  }

}
