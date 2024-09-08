import { isIdentifier } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { Appointment } from 'src/app/models/helper/appointment';
import { Garden } from 'src/app/models/helper/garden';
import { User } from 'src/app/models/user';
import { OwnerService } from 'src/app/services/owner.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

declare var bootstrap: any;

@Component({
  selector: 'app-garden-booking',
  templateUrl: './garden-booking.component.html',
  styleUrls: ['./garden-booking.component.css']
})
export class GardenBookingComponent implements OnInit{

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  company: Company = new Company();
  garden: Garden = new Garden();
  appointment: Appointment = new Appointment();
  error: string = "";
  success: string = "";

  currentStep: number = 1;

  constructor(private router: Router, private ownerService: OwnerService, private sharedVariablesService: SharedVariablesService) {}
  ngOnInit(): void {
    const c = localStorage.getItem("company")
    if(c != null){
      this.company = JSON.parse(c);
    }
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  showSuccessModal(){
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }
  
  minDateValue(){
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  formatDateValue(today: Date){
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  parseTime(date: Date){
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`
  }

  parseDate(date: Date){
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  nextStep() {
    this.error = "";
    if(this.currentStep == 1){
      // date check
      let now = new Date();
      let dateTimeChosen = [];
      if(this.appointment.datetimeScheduled.toString().length > 16){
        dateTimeChosen = this.formatDateValue(this.appointment.datetimeScheduled).split("T");
      }else{
        dateTimeChosen = this.appointment.datetimeScheduled.toString().split("T");
      }
      if(dateTimeChosen[0] <= this.parseDate(now)){
        if(dateTimeChosen[1] <= this.parseTime(now)){
          this.error = "Date and Time field is empty or chosen date and time are in the past.";
        }
      }
      let startDate = new Date(this.company.vacationPeriodStart).setHours(0,0,0,0);
      let endDate = new Date(this.company.vacationPeriodEnd).setHours(0,0,0,0);
      let chosenTime = new Date(this.appointment.datetimeScheduled).setHours(0,0,0,0)
      if(chosenTime >= startDate && chosenTime <= endDate){
        this.error = "Can't book on this date because this is company's vacation period." + `Company vacation period start: ${this.company.vacationPeriodStart.toString().split("T")[0]}, company vacation period end: ${this.company.vacationPeriodEnd.toString().split("T")[0]}.`;
      }
      // garden area check
      if(this.garden.squareMeters <= 0){
        this.error = "Garden area must be positive number.";
      }
    }
    if(this.currentStep == 2){
      if(this.garden.gardenType == "private"){
        if(this.garden.areaPoolFountain + this.garden.areaGreen + this.garden.areaFurniture != this.garden.squareMeters){
          this.error = "Sum of Areas doesn't match garden area."
        }
        if(this.garden.areaFurniture < 0){
          this.error = "Furniture area must be positive number or zero."
        }
        if(this.garden.areaGreen < 0){
          this.error = "Green area must be positive number or zero."
        }
        if(this.garden.areaPoolFountain < 0){
          this.error = "Pool area must be positive number or zero."
        }
      }else{
        if(this.garden.areaPoolFountain + this.garden.areaGreen != this.garden.squareMeters){
          this.error = "Sum of Areas doesn't match garden area."
        }
        if(this.garden.areaFurniture < 0 && Number.isInteger(this.garden.areaFurniture)){
          this.error = "Chair count must be positive number or zero."
        }
        if(this.garden.tableCount < 0 && Number.isInteger(this.garden.tableCount)){
          this.error = "Table count must be positive number or zero."
        }
        if(this.garden.areaGreen < 0){
          this.error = "Green area must be positive number or zero."
        }
        if(this.garden.areaPoolFountain < 0){
          this.error = "Fountain area must be positive number or zero."
        }
      }
      this.sharedVariablesService.gardenType = this.garden.gardenType;
    }
    if(this.error != ""){
      this.showErrorModal();
      return;
    }
    if (this.currentStep < 3) {
      if(this.currentStep == 2){
        localStorage.setItem("garden", JSON.stringify(this.garden));
      }
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    const g = localStorage.getItem("garden")
    if(g != null){
      this.garden = JSON.parse(g)
    }
    this.company.services.forEach(service=>{
      if(service.selected){
        this.garden.services.push(service);
      }
    })
    // set drawing 
    this.garden.design = JSON.stringify(this.sharedVariablesService.shapes);
    this.appointment.garden = this.garden;
    // set owner id
    const u = localStorage.getItem("user");
    let user: User = new User();
    if(u != null){
      user = JSON.parse(u);
    }
    this.appointment.ownerId = user.username;
    this.appointment.datetimeOriginalFinish = this.appointment.datetimeFinished;

    this.ownerService.createAppointment(this.appointment, this.company.name).subscribe(
      data=>{
        if(data.message == "ok"){
          this.success = "You succesfully created appointment, please wait our review."
          this.showSuccessModal();
        }
      }
    )
  }

  goToUserIndex(){
    this.router.navigate(["owner-profile-preview"]);
  }

}
