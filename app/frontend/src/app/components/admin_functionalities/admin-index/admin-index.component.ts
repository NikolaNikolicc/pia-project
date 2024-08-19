import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit{

  constructor(public sharedVariablesService: SharedVariablesService, private router: Router){

  }


  goToListAndDeactivate(){
    this.router.navigate(["admin-list-users-companies"]);
  }
  goToRegisterNewDecorator(){
    this.router.navigate(["register-decorator"]);
  }
  goToRegisterNewCompany(){
    this.router.navigate(["register-company"]);
  }
  goToAssign(){
    this.router.navigate(["assign-company-decorator"]);
  }
  goToRegistrationRequests(){
    this.router.navigate(["list-registration-requests"]);
  }

  ngOnInit(): void {
    this.sharedVariablesService.sessionID = '1';
  }

}
