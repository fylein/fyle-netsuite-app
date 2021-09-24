import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MappingsService } from '../../../../core/services/mappings.service';
import { SettingsService } from 'src/app/core/services/settings.service';
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
              private router: Router) {}

  submit() {
    const that = this;

    const subsidiaryId = that.subsidiaryForm.value.netsuiteSubsidiaries;
    const netsuiteSubsidiary = that.netsuiteSubsidiaries.filter(filteredSubsidiary => filteredSubsidiary.destination_id === subsidiaryId)[0];
    that.isLoading = true;

    const subsidiaryMappingPayload: SubsidiaryMapping = {
      subsidiary_name: netsuiteSubsidiary.value,
      internal_id: netsuiteSubsidiary.destination_id,
      workspace: that.workspaceId
    };

    that.mappingsService.postSubsidiaryMappings(subsidiaryMappingPayload).subscribe(() => {
      that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
    });
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
    that.mappingsService.getNetSuiteDestinationAttributes('SUBSIDIARY').subscribe((subsidiaries) => {
      that.netsuiteSubsidiaries = subsidiaries;
      that.getSubsidiaryMappings();
    });
  }

}
