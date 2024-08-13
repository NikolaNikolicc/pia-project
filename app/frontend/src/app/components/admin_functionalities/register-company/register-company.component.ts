import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { Service } from 'src/app/models/helper/service';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

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
  contactPersonName: string = '';
  vacationPeriodStart: string = '';
  vacationPeriodEnd: string = '';
  phone: string = '';
  services: Service[] = [];
  freeDecorators: Decorator[] = [];
  chosenDecorators: Decorator[] = [];

  constructor(private router: Router, private decoratorService: DecoratorService, public sharedVariablesService: SharedVariablesService, private companyService: CompanyService) { }

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
    this.sharedVariablesService.address = this.address;
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

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\/\s]*$/;
    return phoneRegex.test(phone);
  }

  usernameUniquenessCheck(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.companyService.getCompanyByName(this.companyName).subscribe(
        data => {
          if (data.message == "Company with this name has not been found.") {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  async registerCompanyWrapper() {
    this.error = "";

    this.services.forEach(service => {
      if(service.price <= 0){
        this.error = "Service price field must be greater than 0.";
      }
      if(service.name == ""){
        this.error = "Service name field is empty, fill it or delete that service.";
      }
    });
    
    this.chosenDecorators.forEach(decorator => {
      if(decorator.userId == ""){
        this.error = "Decorator field is empty.";
      }
    });
    
    if(this.chosenDecorators.length < 2){
      this.error = "At least two Decorators must work at company."
    }
    if(this.vacationPeriodEnd == ""){
      this.error = "Vacation end is not chosen.";
    }
    if(this.vacationPeriodStart == ""){
      this.error = "Vacation start is not chosen.";
    }
    if(!this.validatePhone(this.phone)){
      this.error = "Phone number can only contain digits and the following special symbols: \\ - / and space"
    }
    if(this.phone == ""){
      this.error = "Contact person phone field is empty.";
    }
    if(this.contactPersonName == ""){
      this.error = "Contact person field is empty.";
    }
    if(this.address == ""){
      this.error = "Address field is empty.";
    }
    const isUsernameUnique = await this.usernameUniquenessCheck();
    if (!isUsernameUnique) {
      this.error = "This company name has already been used. Please try with another one.";
    }
    if(this.companyName == ""){
      this.error = "Company name field is empty.";
    }
    if(this.error != ""){
      this.showErrorModal();
      return;
    }

    this.registerCompany();
  }

  registerCompany(){

    let decoratorNames: string[] = [];
    this.chosenDecorators.forEach(decorator => {
      decoratorNames.push(decorator.userId)
      decorator.companyId = this.companyName;
    });

    this.decoratorService.setCompanyForDecorators(decoratorNames, this.companyName).subscribe(
      data=>{
        if(data.message == "ok"){
          let company = new Company();
          company.name = this.companyName;
          company.address = this.address;
          company.contactPerson.name = this.contactPersonName;
          company.contactPerson.phone = this.phone;
          company.vacationPeriodStart = new Date(this.vacationPeriodStart);
          company.vacationPeriodEnd = new Date(this.vacationPeriodEnd);
          company.services = this.services;
          company.decorators = this.chosenDecorators;
      
          this.companyService.saveCompany(company).subscribe(
            data=>{
              if(data.message == "ok"){
                this.success = "Company registered successfully!";
                this.showSuccessModal();
              }else{
                this.error = "Something went wrong, please try again.";
                this.showErrorModal();
              }
            }
          )
        }else{
          this.error = "Something went wrong, please try again."
          this.showErrorModal();
          return;
        }
      }
    )


  }

}
