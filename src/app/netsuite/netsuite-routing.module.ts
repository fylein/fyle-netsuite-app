import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetSuiteComponent } from './netsuite.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { WorkspacesGuard } from '../core/guard/workspaces.guard';
import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { NetsuiteCallbackComponent } from './settings/netsuite-callback/netsuite-callback.component';
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { ConfigurationComponent } from './settings/configuration/configuration.component';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { EmployeeMappingsComponent } from './settings/employee-mappings/employee-mappings.component';
import { CategoryMappingsComponent } from './settings/category-mappings/category-mappings.component';
import { ProjectMappingsComponent } from './settings/project-mappings/project-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { CostCenterMappingsComponent } from './settings/cost-center-mappings/cost-center-mappings.component';
import { ConnectNetsuiteComponent } from './settings/connect-netsuite/connect-netsuite.component';
import { NsConnectionComponent } from './settings/connect-netsuite/ns-connection/ns-connection.component';
import { NsSubsidiaryComponent } from './settings/connect-netsuite/ns-subsidiary/ns-subsidiary.component';


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
          component: ConfigurationComponent,
        },
        {
          path: 'netsuite',
          component: ConnectNetsuiteComponent,
          children: [
            {
              path: 'connect',
              component: NsConnectionComponent
            },
            {
              path: 'subsidiary',
              component: NsSubsidiaryComponent
            }
          ]
        },
        {
          path: 'general_mappings',
          component: GeneralMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'employee_mappings',
          component: EmployeeMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'category_mappings',
          component: CategoryMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'project_mappings',
          component: ProjectMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'cost_center_mappings',
          component: CostCenterMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'schedule',
          component: ScheduleComponent,
          canActivate: [WorkspacesGuard]
        }
      ]
    },
    {
      path: 'fyle/callback',
      component: FyleCallbackComponent
    },
    {
      path: 'netsuite/callback',
      component: NetsuiteCallbackComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetSuiteRoutingModule { }
