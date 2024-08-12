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

  login(){
    this.router.navigate(["login"]);
  }

  register(){
    this.router.navigate(["register"]);
  }

  logout(){
    this.router.navigate([""]);
  }

}
