import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { Company } from 'src/app/models/company';
import { Appointment } from 'src/app/models/helper/appointment';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';

declare var bootstrap: any;

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  @ViewChild('successModal') modalSuccess!: ElementRef;
  user: User = new User();
  companies: Company[] = [];
  myAppointments: Appointment[] = [];
  myCompanyName: string[] = [];
  selectedAppointmentComment: string = '';
  selectedAppointmentRating: number = 0;
  selectedAppointment: Appointment | null = null;
  combinedArray: { appointment: Appointment, companyName: string }[] = [];
  success: string = "";

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    let u = localStorage.getItem("user");
    if (u != null) {
        this.user = JSON.parse(u);
        this.companyService.getAllCompanies().subscribe(async companies => {
            if (companies.message) {
                this.companies = JSON.parse(companies.message);
                this.companies.forEach(company => {
                    company.appointments.forEach(appointment => {
                        if (appointment.ownerId === this.user.username) {
                            this.combinedArray.push({
                                appointment: appointment,
                                companyName: company.name
                            });
                        }
                    });
                });

                // Await the completion of the appointment status updates
                await this.updateAppointmentsStatus();

                // Sort the combined array by datetimeCreated in descending order
                this.combinedArray.sort((a, b) => {
                    return new Date(b.appointment.datetimeCreated).getTime() - new Date(a.appointment.datetimeCreated).getTime();
                });

                // Separate the sorted combined array back into the two lists
                this.myAppointments = this.combinedArray.map(item => item.appointment);
                this.myCompanyName = this.combinedArray.map(item => item.companyName);
            }
        });
    }
}

private async updateAppointmentsStatus(): Promise<void> {
    // Collect all observables for updating appointments
    const updateObservables = this.combinedArray.map(item => {
        let app: Appointment = item.appointment;
        if (app.status === "pending" && new Date() > new Date(app.datetimeScheduled)) {
            item.appointment.status = "rejected";
            return this.companyService.updateAppointment(item.appointment, item.companyName)
                .pipe(
                    catchError(err => {
                        console.error('Error updating appointment', err);
                        return of(null); // Handle error and return null
                    })
                );
        } else {
            return of(null); // Return a null observable for cases that don't need an update
        }
    });

    // Wait for all updates to complete
    await forkJoin(updateObservables).toPromise();
}

  setRating(rating: number): void {
    this.selectedAppointmentRating = rating;
  }

  saveCommentAndRating(): void {
    if(this.selectedAppointmentComment == ""){
      return;
    }
    if(this.selectedAppointmentRating <= 0 || this.selectedAppointmentRating >= 6){
      return;
    }
    if (this.selectedAppointment) {
      this.selectedAppointment.ownerComment = this.selectedAppointmentComment;
      this.selectedAppointment.score = this.selectedAppointmentRating;
      // Save the updated appointment to the backend here if necessary
      const cn = localStorage.getItem("companyName");
      if (cn != null) {
        let companyName = cn;
        // Optionally close the modal after saving
        const modal = bootstrap.Modal.getInstance(document.getElementById('commentRatingModal')!);
        modal.hide();
        this.companyService.updateAppointment(this.selectedAppointment, companyName).subscribe(
          data => {
            if (data) {
              this.success = "You have successfully left score and comment on this appointment."
              this.showSuccessModal();
              return;
            }
          }
        )
      }

    }
  }

  validDate(appointment: Appointment): boolean {
    const appointmentDate = new Date(appointment.datetimeFinished);
    const currentDate = new Date();

    // Compare the time values of both dates
    if (appointmentDate.getTime() <= currentDate.getTime()) {
      return true;
    }
    return false;
  }

  showSuccessModal() {
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  currentCheck(app: Appointment){
    return app.status == 'pending' || app.status == 'confirmed' && new Date() <= new Date(app.datetimeFinished)
  }

  anyPending(): boolean {
    if (this.myAppointments.length === 0) return false;
  
    return this.myAppointments.some(app => 
      app.ownerId === this.user.username && this.currentCheck(app)
    );
  }

  anyConfirmed(): boolean{
    if(this.myAppointments.length === 0)return false;

    return this.myAppointments.some(appointment=>{
      (appointment.status == 'confirmed' && this.validDate(appointment)) || appointment.status == "rejected" || appointment.status == "canceled"
    })
  }

  openCommentRatingModal(appointment: Appointment, companyName: string): void {
    this.selectedAppointment = appointment;
    this.selectedAppointmentComment = appointment.ownerComment || "";
    this.selectedAppointmentRating = appointment.score || 0;
    localStorage.setItem("companyName", companyName)
    const modal = new bootstrap.Modal(document.getElementById('commentRatingModal')!);
    modal.show();
  }

  canCancelAppointment(appointment: Appointment): boolean {
    const now = new Date().getTime();
    const scheduledTime = new Date(appointment.datetimeScheduled).getTime();
    const differenceInHours = (scheduledTime - now) / (1000 * 60 * 60); // difference in hours

    return differenceInHours >= 24; // Can cancel if more than 24 hours before scheduled time
  }

  cancelAppointment(appointment: Appointment, companyName: string): void {
    // Update the status or notify the backend as needed
    appointment.status = "canceled";
    this.companyService.updateAppointment(appointment, companyName).subscribe(
      data => {
        if (data.message == "ok") {
          this.success = "You successfully canceled this Appointment."
          this.showSuccessModal();
          return;
        }
      }
    )
  }
}
