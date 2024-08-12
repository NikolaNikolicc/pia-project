import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Decorator } from 'src/app/models/decorator';
import { Service } from 'src/app/models/service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { MapAddressService } from 'src/app/services/map-address.service';

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

  constructor(private router: Router, private decoratorService: DecoratorService, public mapAddressService: MapAddressService) { }

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

  changeAddress(){
    this.mapAddressService.address = this.address;
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
    if(this.chosenDecorators.length == this.freeDecorators.length)return;
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

  getMaxVacationStartDate(): string {
    return this.vacationPeriodEnd ? this.vacationPeriodEnd : '';
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
