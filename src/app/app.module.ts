import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './components/base/base.component';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { TasksComponent } from './components/base/tasks/tasks.component';
import { ExpenseGroupsComponent } from './components/base/expense-groups/expense-groups.component';
import { SettingsComponent } from './components/base/settings/settings.component';
import { MappingsComponent } from './components/base/mappings/mappings.component';
import { CallbackComponent } from './components/auth/callback/callback.component';
import { AuthComponent } from './components/auth/auth.component';
import { JwtInterceptor } from './components/auth/jwt.interceptor';
import { LoaderComponent } from './components/general/loader/loader.component';
import { FyleCallbackComponent } from './components/base/settings/fyle-callback/fyle-callback.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewExpenseGroupComponent } from './components/base/expense-groups/view-expense-group/view-expense-group.component';
import { MappingErrorsComponent } from './components/base/tasks/mapping-errors/mapping-errors.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CategoryComponent } from './components/base/mappings/category/category.component';
import { EmployeeComponent } from './components/base/mappings/employee/employee.component';
import { ProjectComponent } from './components/base/mappings/project/project.component';
import { CostCenterComponent } from './components/base/mappings/cost-center/cost-center.component';
import { BillsComponent } from './components/base/bills/bills.component';
import { GeneralComponent } from './components/base/mappings/general/general.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    LoginComponent,
    LogoutComponent,
    TasksComponent,
    ExpenseGroupsComponent,
    SettingsComponent,
    MappingsComponent,
    CallbackComponent,
    AuthComponent,
    LoaderComponent,
    FyleCallbackComponent,
    ViewExpenseGroupComponent,
    MappingErrorsComponent,
    CategoryComponent,
    EmployeeComponent,
    ProjectComponent,
    CostCenterComponent,
    BillsComponent,
    GeneralComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
