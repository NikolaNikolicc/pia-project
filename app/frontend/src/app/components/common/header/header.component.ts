import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public sharedVariablesService: SharedVariablesService){}
  ngOnInit(): void {

  }

  goToPage(requestIndex: number){
    if(requestIndex == 1){
      this.router.navigate(["owner-profile-preview"]);
    }
    if(requestIndex == 2){
      this.router.navigate(["list-all-companies-owner"]);
    }
    if(requestIndex == 3){
      this.router.navigate(["archive"]);
    }
    if(requestIndex == 4){
      this.router.navigate(["maintenance"]);
    }
    if(requestIndex == 5){
      this.router.navigate(["owner-profile-preview"]);
    }
    if(requestIndex == 6){
      this.router.navigate(["list-appointments"]);
    }
    if(requestIndex == 7){
      this.router.navigate(["list-maintenance-requests"]);
    }
    if(requestIndex == 8){
      this.router.navigate(["statistics"]);
    }
  }

  login(){
    this.router.navigate(["login"]);
  }

  register(){
    this.router.navigate(["register"]);
  }

  logout(){
    this.sharedVariablesService.sessionID = "0";
    this.router.navigate([""]);
  }

}
