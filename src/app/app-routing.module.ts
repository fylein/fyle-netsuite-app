import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const baseModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: '/workspaces',
    pathMatch: 'full'
  },
  {
    path: 'workspaces',
    loadChildren: () => import('./netsuite/netsuite.module').then(m => m.NetSuiteModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'workspaces',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(baseModuleRoutes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
