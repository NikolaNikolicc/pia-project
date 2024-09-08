import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';

declare var bootstrap: any;

@Component({
  selector: 'app-set-vacation',
  templateUrl: './set-vacation.component.html',
  styleUrls: ['./set-vacation.component.css']
})
export class SetVacationComponent implements OnInit{
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  error: string = "";
  success: string = "";
  companies: Company[] = [];
  decorators: Decorator[] = [];
  selectedDecoratorId: string = "";
  selectedCompanyId: string = "";
  vacationPeriodStart: string = '';
  vacationPeriodEnd: string = '';

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

  constructor(private router: Router, private companyService: CompanyService, private decoratorService: DecoratorService){

  }

  getMaxVacationStartDate(): string {
    return this.vacationPeriodEnd ? this.vacationPeriodEnd : '';
  }

  getMinVacationEndDate(): string {
    return this.vacationPeriodStart ? this.vacationPeriodStart : '';
  }

  ngOnInit(): void {
    
    this.decoratorService.getAllUnemployedDecorators().subscribe(
        decorators => {
        if(decorators.message){
          this.decorators = JSON.parse(decorators.message);
        }
    });

    this.companyService.getAllCompanies()
      .subscribe(companies => {
        if(companies.message){
          this.companies = JSON.parse(companies.message);
        }
      });
    
    
    
  }

  goToAdminIndex(){
    this.router.navigate(["admin-index"]);
  }

  loadUnemployedDecorators() {
    this.decoratorService.getAllUnemployedDecorators().subscribe(
      decorators => {
        if (decorators.message) {
          this.decorators = JSON.parse(decorators.message);
        }
      },
      err => {
        this.error = "Failed to load decorators.";
        this.showErrorModal();
      }
    );
  }

  loadCompanies() {
    this.companyService.getAllCompanies().subscribe(
      companies => {
        if (companies.message) {
          this.companies = JSON.parse(companies.message);
        }
      },
      err => {
        this.error = "Failed to load companies.";
        this.showErrorModal();
      }
    );
  }

  assignCompany() {
    if (!this.selectedCompanyId) {
      this.error = "Please select both a decorator and a company.";
      this.showErrorModal();
      return;
    }

    if(this.vacationPeriodEnd == ""){
      this.error = "Vacation end is not chosen.";
    }
    if(this.vacationPeriodStart == ""){
      this.error = "Vacation start is not chosen.";
    }

    let ind =  this.companies.findIndex(c=>(c.name == this.selectedCompanyId))
    let company = this.companies[ind]
    company.vacationPeriodEnd = new Date(this.vacationPeriodEnd)
    company.vacationPeriodStart = new Date(this.vacationPeriodStart)

    this.companyService.updateVacation(company).subscribe(
      ok=>{
        if(ok.message == "ok"){
          this.success = "You have successfully changed vacation period for the company " + this.selectedCompanyId;
          this.showSuccessModal();
        }
      }
    )

  }

  removeAssignedDecorator(decoratorId: string) {
    this.decorators = this.decorators.filter(decorator => decorator.userId !== decoratorId);
  }
}
