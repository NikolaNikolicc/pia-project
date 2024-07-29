import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit{

  @ViewChild('errorModal') modalError!: ElementRef;
  error: string = "";
  username: string = "";
  password: string = "";
  hashedPassword: string = "";
  showPassword: boolean = false;

  constructor(public sessionService: SessionIDsharedService, private userService: UserService, private router: Router){

  }
  ngOnInit(): void {
    this.sessionService.sessionID = '-1';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  loginWrapper(){
    this.error = "";

    if(this.password == ""){
      this.error = "Password field is empty.";
    }
    if(this.username == ""){
      this.error = "Username field is empty.";
    }

    if(this.error != ""){
      this.showErrorModal();
      return;
    }
    this.hashedPassword = this.hashSHA256(this.password);
    this.login();
  }

  hashSHA256(value: string): string {
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
  }

  changePassword(){
    this.router.navigate(["change-password"]);
  }

  login(){
    let user = new User();
    user.username = this.username;
    user.password = this.hashedPassword;
    user.userType = 1;
    this.userService.login(user).subscribe(
      data=>{
        if(data.message != "User with this username has not been found."){
          localStorage.setItem("user", JSON.stringify(user));
          this.router.navigate(["admin-index"]);
        }else{
          this.error = "Invalid credentials or the user doesn't have admin privileges. Please try with another user.";
          this.showErrorModal();
          return;
        }
      }
    );
  }


}
