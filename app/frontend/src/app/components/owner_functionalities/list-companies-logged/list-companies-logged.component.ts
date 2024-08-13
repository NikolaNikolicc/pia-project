import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-companies-logged',
  templateUrl: './list-companies-logged.component.html',
  styleUrls: ['./list-companies-logged.component.css']
})
export class ListCompaniesLoggedComponent implements OnInit{
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
  // for stars preview
  stars: number[] = [0, 1, 2, 3, 4];

  constructor(private router: Router, private companyService: CompanyService, private decoratorService: DecoratorService, private userService: UserService){}
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

  goToPage(companyName: string){
    let company: Company = this.companies.find(company=>company.name == companyName) as Company;
    localStorage.setItem("company", JSON.stringify(company))
    this.router.navigate(['company-preview'])
  }

}
