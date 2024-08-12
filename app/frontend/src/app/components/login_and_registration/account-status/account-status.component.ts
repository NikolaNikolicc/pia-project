import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.css']
})
export class AccountStatusComponent implements OnInit{

  user: User = new User();

  constructor(private router: Router, public sharedVariablesService: SharedVariablesService){}

  ngOnInit(): void {
    this.sharedVariablesService.sessionID = "0";
    let u = localStorage.getItem("user");
    if(u != null){
      this.user = JSON.parse(u);
    }
  }

  backToIndexPage(){
    this.router.navigate([""]);
  }

}
