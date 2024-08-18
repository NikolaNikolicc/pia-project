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

  jobsCompleted: {appointment: Appointment, companyName: string, needsServicing: boolean}[] = [];
  maintenanceNeeded: {appointment: Appointment, companyName: string, needsServicing: boolean}[] = [];
  user: User = new User();
  success: string = "";
  @ViewChild('successModal') modalSuccess!: ElementRef;

  constructor(private companyService: CompanyService) {}

  showSuccessModal() {
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  ngOnInit(): void {
    const u = localStorage.getItem("user");
    if (u != null) {
      this.user = JSON.parse(u);
    }

    this.companyService.getAllCompanies().subscribe(
      companies => {
        if (companies.message) {
          const parsedCompanies: Company[] = JSON.parse(companies.message);
          parsedCompanies.forEach(company => {
            company.appointments.forEach(appointment => {
              if (appointment.ownerId === this.user.username) {
                const today = new Date();
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(today.getMonth() - 6);

                const needsServicing = (new Date(appointment.datetimeFinished) <= sixMonthsAgo && new Date(appointment.datetimeLastTimeServiced) <= sixMonthsAgo) && !appointment.maintenanceScheduled;

                let lastId = appointment.maintenanceTasks.length - 1
                if (appointment.maintenanceTasks[lastId].status === 'in-progress') {
                  this.jobsCompleted.push({ appointment, companyName: company.name, needsServicing });
                } else if (appointment.status === 'confirmed' && today >= new Date(appointment.datetimeFinished)) {
                  this.maintenanceNeeded.push({ appointment, companyName: company.name, needsServicing });
                }
              }
            });
          });
        }
      }
    );
  }

  scheduleServicing(appointment: Appointment, companyName: string, index: number): void {
    appointment.maintenanceScheduled = true;
    const maintenanceTask = new MaintenanceTask();
    maintenanceTask.status = 'pending';
    appointment.maintenanceTasks.push(maintenanceTask);
    this.jobsCompleted.splice(index, 1);
    this.companyService.updateAppointment(appointment, companyName).subscribe(
      data => {
        if (data.message === "ok") {
          this.success = "You have successfully scheduled maintenance. More details about your booking will be available on this page once one of our decorators reviews your request.";
          this.showSuccessModal();
          this.ngOnInit();  // Refresh the data
        }
      }
    );
  }
}
