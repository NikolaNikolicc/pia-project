import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit{

  owners: User[] = [];
  decorators: User[] = [];
  companies: Company[] = [];
  displayOption: string = "24h";
  displayValue: number = 0;
  numberOfDecoratedGardens: number = 0;

  constructor(
    private userService: UserService,
    private decoratorService: DecoratorService,
    private companyService: CompanyService,
  ){}
  
  ngOnInit(): void {
    forkJoin({
      owners: this.userService.getAllOwners(),
      decorators: this.userService.getAllDecorators(),
      companies: this.companyService.getAllCompanies()
    }).subscribe({
      next: (responses) => {
        if (responses.owners.message) {
          this.owners = JSON.parse(responses.owners.message);
        }
        if (responses.decorators.message) {
          this.decorators = JSON.parse(responses.decorators.message);
        }
        if (responses.companies.message) {
          this.companies = JSON.parse(responses.companies.message);
          this.companies.forEach(company=>{
            company.appointments.forEach(appointment => {
              if(appointment.status == "confirmed" && new Date(appointment.datetimeFinished) <= new Date()){
                this.numberOfDecoratedGardens++;
              }
            });
            this.calculateNumberOfCreatedJobs();
          })
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  isDateDifferenceBiggerThanChosen(date: Date){
    const today = new Date();
    let pastDate = new Date();
    if(this.displayOption == "24h"){
      pastDate.setDate(today.getDate() - 1);
    }else if(this.displayOption == "7d"){
      pastDate.setDate(today.getDate() - 7);
    }else{
      pastDate.setDate(today.getDate() - 30);
    }
    return date < pastDate;
  }

  calculateNumberOfCreatedJobs(){
    this.displayValue = 0;
    this.companies.forEach(company=>{
      company.appointments.forEach(appointment => {
        if(
          appointment.status == "confirmed" && 
          !this.isDateDifferenceBiggerThanChosen(new Date(appointment.datetimeCreated))
        ){
          this.displayValue++;
        }
        // if maintenance is scheduled that mean the value in datetimeLastTimeServiced is when job is created
        if(
          appointment.status == "confirmed" &&
          appointment.maintenanceTasks.length > 0){
          appointment.maintenanceTasks.forEach(task=>{
            if(!this.isDateDifferenceBiggerThanChosen(new Date(task.startDate)) && task.status == "in-progress"){
              this.displayValue++;
            }
          })
        }
      });
    })
  }

}
