import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Appointment } from 'src/app/models/helper/appointment';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { Decorator } from 'src/app/models/decorator';

declare var bootstrap: any;

@Component({
  selector: 'app-list-maintenance',
  templateUrl: './list-maintenance.component.html',
  styleUrls: ['./list-maintenance.component.css']
})
export class ListMaintenanceComponent implements OnInit {

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  user!: User;
  company!: Company;
  appointmentsMantenanceNeeded: Appointment[] = [];
  success: string = "";
  error: string = "";

  constructor(private companyService: CompanyService, private decoratorService: DecoratorService) {}

  ngOnInit(): void {
    let u = localStorage.getItem("user");
    if (u != null) {
      this.user = JSON.parse(u);
    }

    this.loadCompanyAppointments();
  }

  showSuccessModal(){
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  loadCompanyAppointments(): void {
    this.decoratorService.getAllEmployedDecorators().subscribe(
      decorators => {
        if (decorators.message) {
          const parsedDecorators: Decorator[] = JSON.parse(decorators.message);
          parsedDecorators.forEach(decorator => {
            if (decorator.userId === this.user.username) {
              this.companyService.getCompanyByName(decorator.companyId).subscribe(
                company => {
                  if (company.message) {
                    this.company = JSON.parse(company.message);
                    this.getAllUnassignedAppointments();
                  }
                }
              );
            }
          });
        }
      }
    );
  }

  getAllUnassignedAppointments(): void {
    this.company.appointments.forEach(appointment => {
      const lastId = appointment.maintenanceTasks.length - 1;
      if (appointment.maintenanceScheduled && appointment.maintenanceTasks[lastId].decoratorId === "") {
        this.appointmentsMantenanceNeeded.push(appointment);
      }
    });
  }

  minDate(appointment: Appointment): string {
    const minDate = (new Date(appointment.datetimeLastTimeServiced) > new Date()) ? 
                     new Date(appointment.datetimeLastTimeServiced) : new Date();
  
    return minDate.toISOString().slice(0, 10);
  }

  confirmMaintenance(appointment: Appointment, estimatedCompletionDate: Date, index: number): void {
    this.error = "";

    if(!estimatedCompletionDate){
      this.error = "Finish date must be set.";
      this.showErrorModal()
      return;
    }
    
    let today = new Date(estimatedCompletionDate);
    if(today <= new Date(this.company.vacationPeriodEnd) && today >= new Date(this.company.vacationPeriodStart)){
      this.error = "Maintenance cannot be booked during the company's vacation period. Please wait for a couple of days until our company is back in office!";
      this.showErrorModal();
      return;
    }
    if(this.error != ""){
      this.showErrorModal();
      return;
    }
      
    const lastId = appointment.maintenanceTasks.length - 1;
    appointment.maintenanceTasks[lastId].decoratorId = this.user.username;
    appointment.maintenanceTasks[lastId].status = 'in-progress';
    appointment.maintenanceTasks[lastId].estimatedCompletionTime = today;
    appointment.maintenanceTasks[lastId].startDate = new Date();
    appointment.datetimeLastTimeServiced = today;

    this.appointmentsMantenanceNeeded.splice(index, 1);
    
    this.companyService.updateAppointment(appointment, this.company.name).subscribe(
      data => {
        if (data.message === "ok") {
          this.success = "Maintenance request confirmed successfully!";
          this.showSuccessModal();
        } else {
          this.error = "Failed to confirm maintenance request.";
          this.showErrorModal();
        }
      }
    );
  }

  rejectMaintenance(appointment: Appointment): void {
    let lastId = appointment.maintenanceTasks.length - 1;
    appointment.maintenanceTasks[lastId].decoratorId = this.user.username;
    appointment.maintenanceTasks[lastId].status = 'rejected';
    // this part is used to set last time garden was serviced
    lastId -= 1;
    while(lastId >= 0){
      if(lastId >= 0 && appointment.maintenanceTasks[lastId].status != 'rejected'){
        appointment.datetimeLastTimeServiced = appointment.maintenanceTasks[lastId].estimatedCompletionTime;
        break;
      }
      lastId -= 1;
    }
    if(lastId < 0){
      appointment.datetimeLastTimeServiced = appointment.datetimeFinished
    }
    appointment.maintenanceScheduled = false;

    this.companyService.updateAppointment(appointment, this.company.name).subscribe(
      data => {
        if (data.message === "ok") {
          this.success = "Maintenance request rejected successfully!";
          this.showSuccessModal();
        } else {
          this.error = "Failed to reject maintenance request.";
          this.showErrorModal();
        }
      }
    );
  }
}
