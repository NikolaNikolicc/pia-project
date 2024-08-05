import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Decorator } from 'src/app/models/decorator';
import { Service } from 'src/app/models/service';
import { DecoratorService } from 'src/app/services/decorator.service';

declare var bootstrap: any;

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit{
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  error: string = "";
  success: string = "";
  // form variables
  companyName: string = '';
  address: string = '';
  mapLocation: string = '';
  contactPerson: string = '';
  vacationPeriodStart: string = '';
  vacationPeriodEnd: string = '';
  services: Service[] = [];
  freeDecorators: Decorator[] = [];
  chosenDecorators: Decorator[] = [];
  mapUrl: string = 'https://www.google.com/maps/place/%D0%A0%D0%BE%D1%81%D0%BF%D0%B8+%D0%8B%D1%83%D0%BF%D1%80%D0%B8%D1%98%D0%B0+21,+%D0%92%D0%B8%D1%88%D1%9A%D0%B8%D1%86%D0%B0/@44.8157961,20.5225679,17z/data=!3m1!4b1!4m6!3m5!1s0x475a7a5c5f44108d:0x8aa48352c8d368c4!8m2!3d44.8157961!4d20.5225679!16s%2Fg%2F11y1kdtrmb?entry=ttu';

  constructor(private router: Router, private decoratorService: DecoratorService) { }

  ngOnInit(): void {
    this.decoratorService.getAllUnemployedDecorators().subscribe(
      data=>{
        if(data.message){
          this.freeDecorators = JSON.parse(data.message);
          if(this.freeDecorators.length < 2){
            this.error = "There is no enough unemployed decorators in system, please add more.";
            this.showErrorModal();
          }
        }
      }
    )
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

  goToAddDecorators(){
    this.router.navigate(["register-decorator"]);
  }

  goToAdminIndex() {
    this.router.navigate(["admin-index"]);
  }

  checkValue(userId: string){
    return this.chosenDecorators.some(decorator => decorator.userId == userId);
  }

  addService() {
    this.services.push(new Service());
  }

  addDecorator() {
    const newDecorator = new Decorator();
    this.chosenDecorators.push(newDecorator);
  }

  removeService(index: number) {
    this.services.splice(index, 1);
  }

  removeDecorator(index: number) {
    if (this.chosenDecorators.length > 2) {
      this.chosenDecorators.splice(index, 1);
    }
  }

  getMinVacationEndDate(): string {
    return this.vacationPeriodStart ? this.vacationPeriodStart : '';
  }

  registerCompany() {
    if (this.companyName && this.address && this.mapLocation && this.contactPerson && this.chosenDecorators.length >= 2) {
      this.success = "Company registered successfully!";
      this.showSuccessModal();
    } else {
      this.error = "Please fill in all required fields and add at least two decorators.";
      this.showErrorModal();
    }
  }

}
