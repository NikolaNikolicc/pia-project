import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { IndexComponent } from './components/index/index.component';
import { AccountStatusComponent } from './components/account-status/account-status.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { UserIndexComponent } from './components/user-index/user-index.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component: RegistrationComponent},
  {path: '', component: IndexComponent},
  {path: 'admin', component: AdminLoginComponent},
  {path: 'status', component: AccountStatusComponent},
  {path: 'admin-index', component: AdminIndexComponent},
  {path: 'user-index', component: UserIndexComponent},
  {path: 'change-password', component: ChangePasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
