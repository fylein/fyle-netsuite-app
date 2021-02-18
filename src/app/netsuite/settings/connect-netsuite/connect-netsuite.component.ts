import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NetSuiteCredentials } from 'src/app/core/models/netsuite-credentials.model';

@Component({
  selector: 'app-connect-netsuite',
  templateUrl: './connect-netsuite.component.html',
  styleUrls: ['./connect-netsuite.component.scss', '../../netsuite.component.scss']
})
export class ConnectNetsuiteComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  connectNetSuiteForm: FormGroup;
  workspaceId: number;
  netsuiteConnectionDone = false;
  nsAccountId: string;

  constructor(private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private mappingsService: MappingsService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) { }

  save() {
    const that = this;
    if (that.connectNetSuiteForm.valid) {
      const netsuiteCredentials: NetSuiteCredentials = {
        ns_account_id: that.nsAccountId || that.connectNetSuiteForm.value.nsAccountId.toUpperCase(),
        ns_token_id: that.connectNetSuiteForm.value.nsTokenId,
        ns_token_secret: that.connectNetSuiteForm.value.nsTokenSecret
      };

      if (netsuiteCredentials) {
        that.isLoading = true;
        that.settingsService.connectNetSuite(that.workspaceId, netsuiteCredentials).subscribe( responses => {
          if (responses) {
            this.mappingsService.postNetSuiteSubsidiaries().subscribe(() => {});
          }
          that.snackBar.open('NetSuite account connected successfully');
          that.netsuiteConnectionDone = true;
          that.isLoading = false;
          that.router.navigateByUrl(`/workspaces/${that.workspaceId}/dashboard`);
        }, err => {
          that.snackBar.open('Wrong credentials, please try again');
          that.isLoading = false;
        });
      } else {
        that.snackBar.open('Please fill all the fields');
        that.connectNetSuiteForm.markAllAsTouched();
      }
    }
  }

  reconnectNetsuite() {
    this.netsuiteConnectionDone = false;
  }

  ngOnInit() {
    const that = this;
    that.isSaveDisabled = false;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getNetSuiteCredentials(that.workspaceId).subscribe((res) => {
      that.netsuiteConnectionDone = true;
      that.nsAccountId = res.ns_account_id;
      that.connectNetSuiteForm = that.formBuilder.group({
        nsAccountId: [res.ns_account_id, Validators.required],
        nsTokenId: ['', Validators.required],
        nsTokenSecret: ['', Validators.required]
      });
      that.connectNetSuiteForm.controls.nsAccountId.disable();
      that.isLoading = false;
    }, (error) => {
      that.isLoading = false;
      that.connectNetSuiteForm = that.formBuilder.group({
        nsAccountId: ['', Validators.required],
        nsTokenId: ['', Validators.required],
        nsTokenSecret: ['', Validators.required]
      });
    });
  }

}
