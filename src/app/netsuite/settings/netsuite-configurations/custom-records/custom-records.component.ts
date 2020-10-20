import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { WindowReferenceService } from 'src/app/core/services/window.service';

@Component({
  selector: 'app-custom-records',
  templateUrl: './custom-records.component.html',
  styleUrls: ['./custom-records.component.scss', '../../../netsuite.component.scss']
})
export class CustomRecordsComponent implements OnInit {
  customRecordsForm: FormGroup
  customFields: FormArray;
  workspaceId: number;
  isLoading: boolean;
  windowReference: Window;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private mappingsService: MappingsService, private windowReferenceService: WindowReferenceService) {
    this.windowReference = this.windowReferenceService.nativeWindow;
   }
  
   createCustomRecord() {
    const that = this;

    const group = that.formBuilder.group({
      record_name: ['', [Validators.required]],
      script_id: ['', [Validators.required]],
      custom_record: ['', [Validators.required]],
    });

    return group;
  }

  addCustomField() {
    const that = this;

    that.customFields = that.customRecordsForm.get('customFields') as FormArray;
    that.customFields.push(that.createCustomRecord());
  }

  saveCustomRecords() {
    const that = this;
    console.log(that.customRecordsForm)

    // TODO: modify this with newly written API

    // that.isLoading = true;    
    // const customFields = that.customRecordsForm.value.customFields;

    // that.settingsService.postMappingSettings(that.workspaceId, customFields).subscribe(response => {
    //   that.router.navigate([`workspaces/${this.workspaceId}/dashboard`]).then(() => {
    //     that.windowReference.location.reload();
    //   });
    //   that.isLoading = false;
    // });
  }

  removeCustomField(index: number) {
    const that = this;

    const customFields = that.customRecordsForm.get('customFields') as FormArray;
    customFields.removeAt(index);
  }

  ngOnInit() {
    const that = this;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;

    const customRecordsFormArray = [that.createCustomRecord()]
    that.customRecordsForm = that.formBuilder.group({
      customFields: that.formBuilder.array(customRecordsFormArray)
    });

  }
}
