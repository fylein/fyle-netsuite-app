import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetSuiteComponent } from './netsuite.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { WorkspacesGuard } from '../core/guard/workspaces.guard';
import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { EmployeeMappingsComponent } from './settings/employee-mappings/employee-mappings.component';
import { CategoryMappingsComponent } from './settings/category-mappings/category-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { ConnectNetsuiteComponent } from './settings/connect-netsuite/connect-netsuite.component';
import { ConfigurationComponent } from './settings/netsuite-configurations/configuration/configuration.component';
import { SubsidiaryComponent } from './settings/netsuite-configurations/subsidiary/subsidiary.component';
import { NetsuiteConfigurationsComponent } from './settings/netsuite-configurations/netsuite-configurations.component';
import { ExpenseFieldConfigurationComponent } from './settings/netsuite-configurations/expense-field-configuration/expense-field-configuration.component';
import { GenericMappingsComponent } from './settings/generic-mappings/generic-mappings.component';
import { CustomSegmentsComponent } from './settings/netsuite-configurations/custom-segments/custom-segments.component';
import { MemoStructureComponent } from './settings/netsuite-configurations/memo-structure/memo-structure.component';
import { SkipExportComponent } from './settings/netsuite-configurations/skip-export/skip-export.component';



const routes: Routes = [{
  path: '',
  component: NetSuiteComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: ':workspace_id/expense_groups',
      component: ExpenseGroupsComponent,
      canActivate: [WorkspacesGuard]
    },
    {
      path: ':workspace_id/dashboard',
      component: DashboardComponent
    },
    {
      path: ':workspace_id/sync_export',
      component: SyncExportComponent,
      canActivate: [WorkspacesGuard],
      children: [
        {
          path: 'sync',
          component: SyncComponent
        },
        {
          path: 'export',
          component: ExportComponent
        }
      ]
    },
    {
      path: ':workspace_id/expense_groups/:expense_group_id/view',
      component: ViewExpenseGroupComponent,
      canActivate: [WorkspacesGuard],
      children: [
        {
          path: 'info',
          component: InfoComponent
        },
        {
          path: 'mapping_errors',
          component: GroupMappingErrorComponent
        },
        {
          path: '**',
          redirectTo: 'info'
        }
      ]
    },
    {
      path: ':workspace_id/settings',
      component: SettingsComponent,
      children: [
        {
          path: 'configurations',
          component: NetsuiteConfigurationsComponent,
          children: [
            {
              path: 'general',
              component: ConfigurationComponent
            },
            {
              path: 'subsidiary',
              component: SubsidiaryComponent
            },
            {
              path: 'expense_fields',
              component: ExpenseFieldConfigurationComponent
            },
            {
              path: 'memo_structure',
              component: MemoStructureComponent
            },
            {
              path: 'skip_export',
              component: SkipExportComponent
            },
            {
              path: 'custom_segments',
              component: CustomSegmentsComponent
            }
          ]
        },
        {
          path: 'netsuite',
          component: ConnectNetsuiteComponent,
        },
        {
          path: 'general/mappings',
          component: GeneralMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'employee/mappings',
          component: EmployeeMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'category/mappings',
          component: CategoryMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: ':source_field/mappings',
          component: GenericMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'schedule',
          component: ScheduleComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'fyle/callback',
          component: FyleCallbackComponent
        }
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetSuiteRoutingModule { }
