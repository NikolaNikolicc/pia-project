import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { IndexComponent } from './components/index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountStatusComponent } from './components/account-status/account-status.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { UserIndexComponent } from './components/user-index/user-index.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { OwnerProfilePreviewComponent } from './components/owner-profile-preview/owner-profile-preview.component';
import { RegistrationRequestsComponent } from './components/registration-requests/registration-requests.component';

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
    RegistrationRequestsComponent
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
