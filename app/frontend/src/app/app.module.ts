import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/login_and_registration/registration/registration.component';
import { LoginComponent } from './components/login_and_registration/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { IndexComponent } from './components/index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountStatusComponent } from './components/login_and_registration/account-status/account-status.component';
import { AdminLoginComponent } from './components/login_and_registration/admin-login/admin-login.component';
import { AdminIndexComponent } from './components/admin_functionalities/admin-index/admin-index.component';
import { UserIndexComponent } from './components/user-index/user-index.component';
import { ChangePasswordComponent } from './components/login_and_registration/change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { OwnerProfilePreviewComponent } from './components/owner_functionalities/owner-profile-preview/owner-profile-preview.component';
import { RegistrationRequestsComponent } from './components/admin_functionalities/registration-requests/registration-requests.component';
import { CompaniesComponent } from './components/owner_functionalities/companies/companies.component';
import { RegisterDecoratorComponent } from './components/admin_functionalities/register-decorator/register-decorator.component';
import { AssignCompanyToDecoratorComponent } from './components/admin_functionalities/assign-company-to-decorator/assign-company-to-decorator.component';
import { RegisterCompanyComponent } from './components/admin_functionalities/register-company/register-company.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HeaderComponent,
    IndexComponent,
    AccountStatusComponent,
    AdminLoginComponent,
    AdminIndexComponent,
    UserIndexComponent,
    ChangePasswordComponent,
    OwnerProfilePreviewComponent,
    RegistrationRequestsComponent,
    CompaniesComponent,
    RegisterDecoratorComponent,
    AssignCompanyToDecoratorComponent,
    RegisterCompanyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
