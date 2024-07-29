import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { IndexComponent } from './components/index/index.component';
import { AdminComponent } from './components/admin/admin.component';
import { AccountStatusComponent } from './components/account-status/account-status.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component: RegistrationComponent},
  {path: '', component: IndexComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'status', component: AccountStatusComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
