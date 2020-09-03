import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetSuiteRoutingModule } from './netsuite-routing.module';
import { NetSuiteComponent } from './netsuite.component';

import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfigurationComponent } from './settings/configuration/configuration.component';
import { MatSelectModule } from '@angular/material/select';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { EmployeeMappingsComponent } from './settings/employee-mappings/employee-mappings.component';
import { CategoryMappingsComponent } from './settings/category-mappings/category-mappings.component';
import { ProjectMappingsComponent } from './settings/project-mappings/project-mappings.component';
import { CostCenterMappingsComponent } from './settings/cost-center-mappings/cost-center-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeMappingsDialogComponent } from './settings/employee-mappings/employee-mappings-dialog/employee-mappings-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CategoryMappingsDialogComponent } from './settings/category-mappings/category-mappings-dialog/category-mappings-dialog.component';
import { ProjectMappingsDialogComponent } from './settings/project-mappings/project-mappings-dialog/project-mappings-dialog.component';
import { CostCenterMappingsDialogComponent } from './settings/cost-center-mappings/cost-center-mappings-dialog/cost-center-mappings-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConnectNetsuiteComponent } from './settings/connect-netsuite/connect-netsuite.component';
import { NsConnectionComponent } from './settings/connect-netsuite/ns-connection/ns-connection.component';
import { NsSubsidiaryComponent } from './settings/connect-netsuite/ns-subsidiary/ns-subsidiary.component';

@NgModule({
  declarations: [
    NetSuiteComponent,
    ExpenseGroupsComponent,
    ViewExpenseGroupComponent,
    SettingsComponent,
    FyleCallbackComponent,
    InfoComponent,
    GroupMappingErrorComponent,
    SyncExportComponent,
    DashboardComponent,
    SyncComponent,
    ExportComponent,
    ConfigurationComponent,
    GeneralMappingsComponent,
    EmployeeMappingsComponent,
    CategoryMappingsComponent,
    ProjectMappingsComponent,
    CostCenterMappingsComponent,
    ScheduleComponent,
    EmployeeMappingsDialogComponent,
    CategoryMappingsDialogComponent,
    ProjectMappingsDialogComponent,
    CostCenterMappingsDialogComponent,
    ConnectNetsuiteComponent,
    NsConnectionComponent,
    NsSubsidiaryComponent
  ],
  entryComponents: [
    EmployeeMappingsDialogComponent,
    CategoryMappingsDialogComponent,
    ProjectMappingsDialogComponent,
    CostCenterMappingsDialogComponent
  ],
  imports: [
    CommonModule,
    NetSuiteRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true }
    }
  ]
})
export class NetSuiteModule { }
