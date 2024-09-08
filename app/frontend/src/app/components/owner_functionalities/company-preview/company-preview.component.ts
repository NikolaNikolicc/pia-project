import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-company-preview',
  templateUrl: './company-preview.component.html',
  styleUrls: ['./company-preview.component.css']
})
export class CompanyPreviewComponent implements OnInit {

  company: Company = new Company();
  companies: Company[] = [];
  employedDecorators: Decorator[] = [];
  users: User[] = [];
  allEmployeesAreNotSuspended: boolean = false;

  constructor(private sharedVariablesService: SharedVariablesService, private companyService: CompanyService, private decoratorService: DecoratorService, private userService: UserService) { }

  ngOnInit(): void {

    const c = localStorage.getItem("company")
    if(c != null){
      this.company = JSON.parse(c)
      this.sharedVariablesService.address = this.company.address;
    }
    this.companyService.getAllCompanies().subscribe(
      companies=>{
        if(companies.message){
          this.companies = JSON.parse(companies.message)
          this.decoratorService.getAllEmployedDecorators().subscribe(
            decorators=>{
              if(decorators.message){
                this.employedDecorators = JSON.parse(decorators.message)
                this.userService.getAllDecorators().subscribe(
                  dec=>{
                    if(dec.message){
                      this.users = JSON.parse(dec.message)
                      for(let i = 0; i < this.employedDecorators.length; i++){
                        let ed = this.employedDecorators[i]
                        if(ed.companyId == this.company.name ){
                          this.allEmployeesAreNotSuspended = this.users.some(u=>(u.username == ed.userId && u.pendingApproval == 1))
                          if(this.allEmployeesAreNotSuspended){
                            break;
                          }
                        }
                      }
                    }
                  }
                )
              }
            }
          )
        }
      }
    )
  }

}
