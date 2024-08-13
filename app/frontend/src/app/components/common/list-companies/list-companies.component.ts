import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.css']
})
export class ListCompaniesComponent implements OnInit{
  companies: Company[] = []
  // this variable is used to save whole list for new search session
  originalCompanies: Company[] = [];
  decorators: Decorator[] = []
  users: User[] = [];
  // sorting params
  searchName: string = '';
  searchAddress: string = '';
  sortColumn: string = 'name';
  sortDirection: string = 'desc';

  constructor(private companyService: CompanyService, private decoratorService: DecoratorService, private userService: UserService){}
  ngOnInit(): void {
    this.companyService.getAllCompanies().subscribe(
      companies=>{
        if(companies.message){
          this.companies = JSON.parse(companies.message);
          this.decoratorService.getAllEmployedDecorators().subscribe(
            decorators=>{
              if(decorators.message){
                this.decorators = JSON.parse(decorators.message);
                let usernames: string[] = [];
                this.decorators.forEach(decorator => {
                  usernames.push(decorator.userId);
                });
                this.userService.getInfoForThisUsernames(usernames).subscribe(
                  users=>{
                    if(users.message){
                      this.users = JSON.parse(users.message);
                      this.matchDecoratorsWithUsers();
                      this.matchCompaniesWithDecorators();
                      this.originalCompanies = this.companies;
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

  matchDecoratorsWithUsers(): void {
    this.decorators.forEach(decorator => {
      const user = this.users.find(u => u.username === decorator.userId);
      if (user) {
        decorator.user = user;
      }
    });
  }

  matchCompaniesWithDecorators(): void {
    this.companies.forEach(company => {
      company.decs = this.decorators.filter(decorator => decorator.companyId === company.name);
    });
  }

  sortCompanies(): void {
    if (this.sortColumn) {
      this.companies.sort((a, b) => {
        const valueA = a[this.sortColumn as keyof Company]?.toString().toLowerCase() || '';
        const valueB = b[this.sortColumn as keyof Company]?.toString().toLowerCase() || '';
  
        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortCompanies();
  }

  search(): void {
    this.companies = this.originalCompanies.filter(company => {
      const matchesName = company.name.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesAddress = company.address.toLowerCase().includes(this.searchAddress.toLowerCase());
      return matchesName && matchesAddress;
    });

    this.sortCompanies();  // Apply sorting after filtering
  }

}
