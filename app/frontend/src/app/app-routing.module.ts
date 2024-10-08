import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login_and_registration/login/login.component';
import { RegistrationComponent } from './components/login_and_registration/registration/registration.component';
import { IndexComponent } from './components/common/index/index.component';
import { AccountStatusComponent } from './components/login_and_registration/account-status/account-status.component';
import { AdminLoginComponent } from './components/login_and_registration/admin-login/admin-login.component';
import { AdminIndexComponent } from './components/admin_functionalities/admin-index/admin-index.component';
import { UserIndexComponent } from './components/user-index/user-index.component';
import { ChangePasswordComponent } from './components/login_and_registration/change-password/change-password.component';
import { OwnerProfilePreviewComponent } from './components/owner_functionalities/owner-profile-preview/owner-profile-preview.component';
import { RegistrationRequestsComponent } from './components/admin_functionalities/registration-requests/registration-requests.component';
import { RegisterDecoratorComponent } from './components/admin_functionalities/register-decorator/register-decorator.component';
import { RegisterCompanyComponent } from './components/admin_functionalities/register-company/register-company.component';
import { AssignCompanyToDecoratorComponent } from './components/admin_functionalities/assign-company-to-decorator/assign-company-to-decorator.component';
import { CompanyPreviewComponent } from './components/owner_functionalities/company-preview/company-preview.component';
import { ListCompaniesLoggedComponent } from './components/owner_functionalities/list-companies-logged/list-companies-logged.component';
import { ListAppointmentsComponent } from './components/decorator_functionalities/list-appointments/list-appointments.component';
import { ArchiveComponent } from './components/owner_functionalities/archive/archive.component';
import { GardenMaintenanceComponent } from './components/owner_functionalities/garden-maintenance/garden-maintenance.component';
import { ListMaintenanceComponent } from './components/decorator_functionalities/list-maintenance/list-maintenance.component';
import { StatisticsComponent } from './components/decorator_functionalities/statistics/statistics.component';
import { ListUsersDecoratorsCompaniesComponent } from './components/admin_functionalities/list-users-decorators-companies/list-users-decorators-companies.component';
import { CompanyPreviewNoBookingComponent } from './components/admin_functionalities/company-preview-no-booking/company-preview-no-booking.component';
import { SetVacationComponent } from './components/admin_functionalities/set-vacation/set-vacation.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component: RegistrationComponent},
  {path: '', component: IndexComponent},
  {path: 'admin', component: AdminLoginComponent},
  {path: 'status', component: AccountStatusComponent},
  {path: 'admin-index', component: AdminIndexComponent},
  {path: 'user-index', component: UserIndexComponent},
  {path: 'change-password', component: ChangePasswordComponent},
  {path: 'owner-profile-preview', component: OwnerProfilePreviewComponent},
  {path: 'list-registration-requests', component: RegistrationRequestsComponent},
  {path: 'register-decorator', component: RegisterDecoratorComponent},
  {path: 'register-company', component: RegisterCompanyComponent},
  {path: 'assign-company-decorator', component: AssignCompanyToDecoratorComponent},
  {path: 'company-preview', component: CompanyPreviewComponent},
  {path: 'list-all-companies-owner', component: ListCompaniesLoggedComponent},
  {path: 'list-appointments', component: ListAppointmentsComponent},
  {path: 'archive', component: ArchiveComponent},
  {path: 'maintenance', component: GardenMaintenanceComponent},
  {path: 'list-maintenance-requests', component: ListMaintenanceComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'admin-list-users-companies', component: ListUsersDecoratorsCompaniesComponent},
  {path: 'admin-company-preview', component: CompanyPreviewNoBookingComponent},
  {path: 'vacation', component: SetVacationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
