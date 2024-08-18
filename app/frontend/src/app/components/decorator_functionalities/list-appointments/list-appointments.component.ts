import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { Appointment } from 'src/app/models/helper/appointment';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { PhotoService } from 'src/app/services/photo.service';

declare var bootstrap: any;

@Component({
  selector: 'app-list-appointments',
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.css']
})
export class ListAppointmentsComponent implements OnInit{

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  user!: User;
  decorators: Decorator[] = [];
  company!: Company;
  appointments: Appointment[] = [];
  error: string = "";
  success: string = "";
  date!: Date;

  constructor(private companyService: CompanyService, private decoratorService: DecoratorService, private photoService: PhotoService){}

  ngOnInit(): void {
    const u = localStorage.getItem("user")
    if(u != null){
      this.user = JSON.parse(u)
      this.decoratorService.getAllEmployedDecorators().subscribe(
        decs=>{
          if(decs.message){
            this.decorators = JSON.parse(decs.message);
            this.decorators.forEach(dec => {
              if(dec.userId == this.user.username){
                this.companyService.getCompanyByName(dec.companyId).subscribe(
                  comp=>{
                    if(comp.message){
                      this.company = JSON.parse(comp.message);
                      this.appointments = this.company.appointments.sort((a, b) => {
                        return new Date(b.datetimeCreated).getTime() - new Date(a.datetimeCreated).getTime();
                      });
                    }
                  }
                )
              }
            });
          }
        }
      )
    }
  }

  showSuccessModal(){
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  anyUnconfirmedAppontment(){
    return this.appointments.some(appointment=>appointment.status == "pending");
  }

  anyMineAppointment(){
    return this.appointments.some(appointment=>appointment.decoratorID == this.user.username && appointment.status == "confirmed");
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  confirmAppointment(appointment: Appointment) {
    this.error = "";
    if(appointment.datetimeCreated == appointment.datetimeFinished){
      this.error = "Finish date is required for confirmation."
      this.showErrorModal();
      return;
    }
    let dateTimeChosen: string[] = appointment.datetimeFinished.toString().split("T");
    let startDate = this.company.vacationPeriodEnd.toString().split("T")[0];
    let endDate = this.company.vacationPeriodEnd.toString().split("T")[0];
    if(dateTimeChosen[0] >= startDate && dateTimeChosen[0] <= endDate){
      this.error = "Can't book on this date because this is company's vacation period.";
    }
    if(this.error != ""){
      this.showErrorModal();
    }
    appointment.decoratorID = this.user.username;
    appointment.datetimeLastTimeServiced = appointment.datetimeFinished;
    appointment.status = 'confirmed';
    appointment.decoratorID = this.user.username;
    // Call service to update appointment in backend
    this.companyService.updateAppointment(appointment, this.company.name).subscribe(
      data=>{
        if(data.message == "ok"){
          this.success = "Your task has been successfully accepted."
          for(let i = 0; i < this.company.appointments.length; i++){
            if(this.company.appointments[i].appointmentId == appointment.appointmentId){
              this.company.appointments[i] = appointment;
              break;
            }
          }
          this.showSuccessModal();
        }
        else{
          this.error = data.message;
          this.showErrorModal();
        }
      }
    )
  }

  rejectAppointment(appointment: Appointment, comment: string) {
    this.error = "";
    if (comment.trim() === '') {
      this.error = 'Comment is required for rejection.';
      this.showErrorModal();
      return;
    }   
    if(this.error != ""){
      this.showErrorModal();
    }
    appointment.status = 'rejected';
    appointment.decoratorID = this.user.username;
    appointment.decoratorComment = comment;
    // Call service to update appointment in backend
    this.companyService.updateAppointment(appointment, this.company.name).subscribe(
      data=>{
        if(data.message == "ok"){
          this.success = "This task has been successfully declined."
          for(let i = 0; i < this.company.appointments.length; i++){
            if(this.company.appointments[i].appointmentId == appointment.appointmentId){
              this.company.appointments[i] = appointment;
              break;
            }
          }
          this.showSuccessModal();
        }
      }
    )
  }

  showUploadButton(datetimeFinished: Date): boolean {
    const today = new Date();
    return new Date(datetimeFinished) >= new Date(today.setHours(0, 0, 0, 0));
  }

  // Function to handle picture upload
  uploadPictures(appointment: any) {
    // Trigger file input to upload multiple pictures
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg, image/jpg';
    fileInput.multiple = true;
  
    fileInput.onchange = (event: any) => {
      const files = event.target.files as FileList; // Cast to FileList
      if (files.length > 0) {
        const imageBlobs: Blob[] = [];
        const imageNames: string[] = [];
  
        // Convert FileList to Blob array and extract file names
        Array.from(files).forEach((file: File) => {
          imageBlobs.push(file);
          imageNames.push(file.name);
        });
  
        // Call the savePhotos method from the photo service
        this.photoService.savePhotos(
          imageBlobs,
          imageNames,
          this.company.name,
          this.user.username,
          appointment.appointmentId
        ).subscribe(response => {
          console.log('Photos uploaded successfully:', response);
          appointment.photosUploaded = true;
          this.companyService.updateAppointment(appointment, this.company.name).subscribe(
            data=>{
              if(data){
                this.success = "Photos uploaded successfully.";
                this.showSuccessModal();
              }
            }
          )
        }, error => {
          console.error('Error uploading photos:', error);
        });
      }
    };
  
    fileInput.click();
  }
  
}
