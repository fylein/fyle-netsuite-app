import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ns-connection',
  templateUrl: './ns-connection.component.html',
  styleUrls: ['./ns-connection.component.scss', '../../../netsuite.component.scss']
})
export class NsConnectionComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  connectNetSuiteForm: FormGroup;
  workspaceId: number;
  netsuiteConnectionDone: boolean;

  constructor(private formBuilder: FormBuilder, 
              private settingsService: SettingsService, 
              private mappingsService: MappingsService, 
              private route: ActivatedRoute, 
              private router: Router, 
              private snackBar: MatSnackBar) { }

  save() {
    const that = this;
    const netsuiteCredentials = {
      ns_account_id: that.connectNetSuiteForm.value.nsAccountId,
      ns_consumer_key: that.connectNetSuiteForm.value.nsConsumerKey,
      ns_consumer_secret: that.connectNetSuiteForm.value.nsConsumerSecret,
      ns_token_id: that.connectNetSuiteForm.value.nsTokenId,
      ns_token_secret: that.connectNetSuiteForm.value.nsTokenSecret
    }
    if (netsuiteCredentials) {
      that.isLoading = true;
      that.netsuiteConnectionDone = false;
      that.settingsService.connectNetSuite(that.workspaceId, netsuiteCredentials).subscribe( responses => {
        if (responses) {
          this.mappingsService.postNetSuiteSubsidiaries().subscribe(response => {
          });
        }
        that.snackBar.open('NetSuite account connected successfully');
        that.netsuiteConnectionDone = true;
        that.isLoading = false;
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }, err => {
        that.snackBar.open('Wrong credentials, please try again');
        that.isLoading = false;
        that.netsuiteConnectionDone = false;
      });
    } else {
      that.snackBar.open('Please fill all the fields');
      that.connectNetSuiteForm.markAllAsTouched();
    }
  }

  ngOnInit() {
    const that = this;
    that.isSaveDisabled = false;
    that.workspaceId = that.route.snapshot.parent.parent.params.workspace_id;
    that.isLoading = true;
    that.settingsService.getNetSuiteCredentials(that.workspaceId).subscribe((res) => {
      that.netsuiteConnectionDone = true;
      that.isLoading = false;
    }, (error) => {
      that.isLoading = false;
      that.connectNetSuiteForm = that.formBuilder.group({
        nsAccountId: ['', Validators.required],
        nsConsumerKey: ['', Validators.required],
        nsConsumerSecret: ['', Validators.required],
        nsTokenId: ['', Validators.required],
        nsTokenSecret: ['', Validators.required]
      });
    });
  }

}
