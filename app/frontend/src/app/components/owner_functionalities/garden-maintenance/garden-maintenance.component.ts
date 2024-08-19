import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Appointment } from 'src/app/models/helper/appointment';
import { MaintenanceTask } from 'src/app/models/helper/maintenance-task';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';

declare var bootstrap: any;

@Component({
  selector: 'app-garden-maintenance',
  templateUrl: './garden-maintenance.component.html',
  styleUrls: ['./garden-maintenance.component.css']
})
export class GardenMaintenanceComponent implements OnInit {

  @ViewChild('successModal') modalSuccess!: ElementRef;
  @ViewChild('errorModal') modalError!: ElementRef;
  jobsCompleted: {appointment: Appointment, companyName: string, needsServicing: boolean}[] = [];
  maintenanceNeeded: {appointment: Appointment, companyName: string, needsServicing: boolean}[] = [];
  companies: Company[] = [];
  user: User = new User();
  success: string = "";
  error: string = "";

  constructor(private companyService: CompanyService) {}

  showSuccessModal() {
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  showErrorModal() {
    const modalNative: HTMLElement = this.modalError.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  async resetMaintenanceTasks(): Promise<void> {
    const updatePromises: Promise<any>[] = [];
  
    this.companies.forEach(company => {
      company.appointments.forEach(appointment => {
        if (appointment.ownerId === this.user.username && new Date(appointment.datetimeLastTimeServiced) <= new Date() && appointment.maintenanceScheduled) {
          appointment.maintenanceScheduled = false;
          const updatePromise = this.companyService.updateAppointment(appointment, company.name).toPromise();
          updatePromises.push(updatePromise);
        }
      });
    });
  
    try {
      await Promise.all(updatePromises);
      console.log('All maintenance tasks have been reset.');
    } catch (error) {
      console.error('An error occurred while resetting maintenance tasks:', error);
    }
  }
  

  async ngOnInit(): Promise<void> {
    const u = localStorage.getItem("user");
    if (u != null) {
      this.user = JSON.parse(u);
    }

    this.companyService.getAllCompanies().subscribe(
      async companies => {
        if (companies.message) {
          const parsedCompanies: Company[] = JSON.parse(companies.message);
          this.companies = parsedCompanies;

          await this.resetMaintenanceTasks();
          
          parsedCompanies.forEach(company => {
            company.appointments.forEach(appointment => {
              if (appointment.ownerId === this.user.username) {
                const today = new Date();
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(today.getMonth() - 6);

                const needsServicing = (new Date(appointment.datetimeFinished) <= sixMonthsAgo && new Date(appointment.datetimeLastTimeServiced) <= sixMonthsAgo) && !appointment.maintenanceScheduled;

                let lastId = appointment.maintenanceTasks.length - 1
                if (appointment.maintenanceScheduled && appointment.maintenanceTasks.length > 0 && (appointment.maintenanceTasks[lastId].status == 'in-progress' || appointment.maintenanceTasks[lastId].status == 'pending')) {
                  this.maintenanceNeeded.push({ appointment, companyName: company.name, needsServicing });
                } else if (appointment.status === 'confirmed' && today >= new Date(appointment.datetimeFinished)) {
                  
                  this.jobsCompleted.push({ appointment, companyName: company.name, needsServicing });
                }
              }
            });
          });
        }
      }
    );
  }

  scheduleServicing(appointment: Appointment, companyName: string, index: number): void {
    this.error = "";
    
    let cmp: Company = this.companies.find(company=>company.name == companyName) as Company;
    let today: Date = new Date();
    if(today <= new Date(cmp.vacationPeriodEnd) && today >= new Date(cmp.vacationPeriodStart)){
      this.error = "Maintenance cannot be booked during the company's vacation period. Please wait for a couple of days until our company is back in office!";
      this.showErrorModal();
      return;
    }
    
    appointment.datetimeLastTimeServiced = new Date();
    appointment.maintenanceScheduled = true;
    const maintenanceTask = new MaintenanceTask();
    maintenanceTask.status = 'pending';
    appointment.maintenanceTasks.push(maintenanceTask);
    this.jobsCompleted.splice(index, 1);
    this.maintenanceNeeded.push({appointment: appointment, companyName: companyName, needsServicing: false});
    this.companyService.updateAppointment(appointment, companyName).subscribe(
      data => {
        if (data.message === "ok") {
          this.success = "You have successfully scheduled maintenance. More details about your booking will be available on this page once one of our decorators reviews your request.";
          this.showSuccessModal();
        }
      }
    );
  }
}
