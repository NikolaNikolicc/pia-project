import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { UserService } from 'src/app/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-list-users-decorators-companies',
  templateUrl: './list-users-decorators-companies.component.html',
  styleUrls: ['./list-users-decorators-companies.component.css']
})
export class ListUsersDecoratorsCompaniesComponent implements OnInit {

  owners: User[] = [];
  decorators: User[] = [];
  decoratorCompanies: Decorator[] = [];
  companies: Company[] = [];

  selectedOption: string = 'owners';
  selectedUser!: User;
  deactivationReason: string = '';

  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private decoratorService: DecoratorService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    forkJoin({
      companies: this.companyService.getAllCompanies(),
      owners: this.userService.getAllOwners(),
      decorators: this.userService.getAllDecorators(),
      employedDecorators: this.decoratorService.getAllEmployedDecorators(),
      unemployedDecorators: this.decoratorService.getAllUnemployedDecorators()
    }).subscribe({
      next: (responses) => {
        if (responses.companies.message) {
          this.companies = JSON.parse(responses.companies.message);
        }
        if (responses.owners.message) {
          this.owners = JSON.parse(responses.owners.message);
        }
        if (responses.decorators.message) {
          this.decorators = JSON.parse(responses.decorators.message);
        }
        if (responses.employedDecorators.message) {
          this.decoratorCompanies = JSON.parse(responses.employedDecorators.message);
        }
        if (responses.unemployedDecorators.message) {
          const d: Decorator[] = JSON.parse(responses.unemployedDecorators.message);
          d.forEach(decorator => {
            this.decoratorCompanies.push(decorator);
          });
        }
        // filter suspended decorators
        this.decoratorCompanies = this.decoratorCompanies.filter(decorator => {
          return this.decorators.some(dec => dec.username === decorator.userId);
        });
      },
      error: (error) => {
        console.error('Error loading data', error);
      }
    });
  }

  onSelectionChange() {
    // Handle the selection change if needed
  }

  openDeactivateModalDecorator(user: Decorator) {
    for (let i = 0; i < this.decorators.length; i++) {
      if (this.decorators[i].username === user.userId) {
        this.selectedUser = this.decorators[i];
        break;
      }
    }
    const modal = new bootstrap.Modal(document.getElementById('deactivateModal')!);
    modal.show();

  }

  openDeactivateModalOwner(user: User) {
    this.selectedUser = user;
    const modal = new bootstrap.Modal(document.getElementById('deactivateModal')!);
    modal.show();
  }

  deactivateUser() {
    if (this.selectedUser && this.deactivationReason) {
      this.selectedUser.pendingApproval = 0;
      this.selectedUser.comment = this.deactivationReason;

      this.userService.updateUserStatus(this.selectedUser).subscribe(
        ok => {
          if (ok.message) {
            window.location.reload();
          }
        }
      )


    }
  }

  viewDetailsOwner(item: User) {
    localStorage.setItem("user", JSON.stringify(item));
    this.router.navigate(["owner-profile-preview"]);
  }

  viewDetailsDecorator(item: Decorator) {
    for (let i = 0; i < this.decorators.length; i++) {
      if (this.decorators[i].username === item.userId) {
        localStorage.setItem("user", JSON.stringify(this.decorators[i]));
        this.router.navigate(["owner-profile-preview"]);
        return;
      }
    }
  }

  viewDetailsCompany(item: Company) {
    localStorage.setItem("company", JSON.stringify(item));
    this.router.navigate(["admin-company-preview"]);
  }

}
