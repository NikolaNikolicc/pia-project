import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';

declare var bootstrap: any;

@Component({
  selector: 'app-assign-company-to-decorator',
  templateUrl: './assign-company-to-decorator.component.html',
  styleUrls: ['./assign-company-to-decorator.component.css']
})
export class AssignCompanyToDecoratorComponent implements OnInit{
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  error: string = "";
  success: string = "";
  companies: Company[] = [];
  decorators: Decorator[] = [];
  selectedDecoratorId: string = "";
  selectedCompanyId: string = "";

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
    if (!this.selectedDecoratorId || !this.selectedCompanyId) {
      this.error = "Please select both a decorator and a company.";
      this.showErrorModal();
      return;
    }

    this.decoratorService.setCompanyForDecorators([this.selectedDecoratorId], this.selectedCompanyId).subscribe(
      response=>{
        if(response.message == "ok"){
          this.success = "Company successfully assigned to decorator.";
          this.removeAssignedDecorator(this.selectedDecoratorId);
          this.showSuccessModal();
        } else {
                this.error = "Failed to assign company to decorator.";
                this.showErrorModal();
        }
      }
    )

  }

  removeAssignedDecorator(decoratorId: string) {
    this.decorators = this.decorators.filter(decorator => decorator.userId !== decoratorId);
  }
}
