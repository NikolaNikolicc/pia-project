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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
