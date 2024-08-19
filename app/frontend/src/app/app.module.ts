import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/login_and_registration/registration/registration.component';
import { LoginComponent } from './components/login_and_registration/login/login.component';
import { HeaderComponent } from './components/common/header/header.component';
import { IndexComponent } from './components/common/index/index.component';
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
import { RegisterDecoratorComponent } from './components/admin_functionalities/register-decorator/register-decorator.component';
import { AssignCompanyToDecoratorComponent } from './components/admin_functionalities/assign-company-to-decorator/assign-company-to-decorator.component';
import { RegisterCompanyComponent } from './components/admin_functionalities/register-company/register-company.component';
import { MapPreviewComponent } from './components/common/map-preview/map-preview.component';
import { GardenBookingComponent } from './components/owner_functionalities/garden-booking/garden-booking.component';
import { ListCompaniesComponent } from './components/common/list-companies/list-companies.component';
import { ListCompaniesLoggedComponent } from './components/owner_functionalities/list-companies-logged/list-companies-logged.component';
import { CompanyPreviewComponent } from './components/owner_functionalities/company-preview/company-preview.component';
import { CanvasComponent } from './components/owner_functionalities/canvas/canvas.component';
import { ListAppointmentsComponent } from './components/decorator_functionalities/list-appointments/list-appointments.component';
import { ArchiveComponent } from './components/owner_functionalities/archive/archive.component';
import { GardenMaintenanceComponent } from './components/owner_functionalities/garden-maintenance/garden-maintenance.component';
import { ListMaintenanceComponent } from './components/decorator_functionalities/list-maintenance/list-maintenance.component';
import { StatisticsComponent } from './components/decorator_functionalities/statistics/statistics.component';
import { BarChartComponent } from './components/decorator_functionalities/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/decorator_functionalities/pie-chart/pie-chart.component';
import { HistogramChartComponent } from './components/decorator_functionalities/histogram-chart/histogram-chart.component';
import { ListUsersDecoratorsCompaniesComponent } from './components/admin_functionalities/list-users-decorators-companies/list-users-decorators-companies.component';
import { CompanyPreviewNoBookingComponent } from './components/admin_functionalities/company-preview-no-booking/company-preview-no-booking.component';
import { GeneralComponent } from './components/common/general/general.component';
import { PhotoGalleryComponent } from './components/common/photo-gallery/photo-gallery.component';

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
    RegisterDecoratorComponent,
    AssignCompanyToDecoratorComponent,
    RegisterCompanyComponent,
    MapPreviewComponent,
    GardenBookingComponent,
    ListCompaniesComponent,
    ListCompaniesLoggedComponent,
    CompanyPreviewComponent,
    CanvasComponent,
    ListAppointmentsComponent,
    ArchiveComponent,
    GardenMaintenanceComponent,
    ListMaintenanceComponent,
    StatisticsComponent,
    BarChartComponent,
    PieChartComponent,
    HistogramChartComponent,
    ListUsersDecoratorsCompaniesComponent,
    CompanyPreviewNoBookingComponent,
    GeneralComponent,
    PhotoGalleryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
