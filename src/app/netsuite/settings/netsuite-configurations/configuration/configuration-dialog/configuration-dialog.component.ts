import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdatedConfiguration } from 'src/app/core/models/updated-configuration';

@Component({
  selector: 'app-configuration-dialog',
  templateUrl: './configuration-dialog.component.html',
  styleUrls: ['./configuration-dialog.component.scss']
})
export class ConfigurationDialogComponent implements OnInit {
  updatedConfiguration: UpdatedConfiguration;
  customStyle: object = {};

  constructor(public dialogRef: MatDialogRef<ConfigurationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UpdatedConfiguration) { }

  redirectToEmployeeMappings(): boolean {
    const that = this;

    if (that.updatedConfiguration.employee && !that.updatedConfiguration.autoCreateDestinationEntity && that.updatedConfiguration.employee.oldValue !== that.updatedConfiguration.employee.newValue) {
      return true;
    }

    return false;
  }

  submit() {
    const that = this;

    that.dialogRef.close({
      redirectToEmployeeMappings: that.redirectToEmployeeMappings(),
      accpetedChanges: true
    });
  }

  updateStyle() {
    const that = this;

    if (that.updatedConfiguration.cccExpense && that.updatedConfiguration.cccExpense.oldValue !== 'CREDIT CARD CHARGE') {
      that.customStyle = {'margin-right': '10%'};
    }
  }

  ngOnInit() {
    const that = this;

    that.updatedConfiguration = that.data;
    that.updateStyle();
  }

}
