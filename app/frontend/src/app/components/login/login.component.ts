import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';
import * as CryptoJS from 'crypto-js';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  @ViewChild('errorModal') modalError!: ElementRef;
  error: string = "";
  username: string = "";
  password: string = "";
  hashedPassword: string = "";
  showPassword: boolean = false;

  constructor(private router: Router, public sessionService: SessionIDsharedService, private userService: UserService){

  }

  ngOnInit(): void {
    this.sessionService.sessionID = '0';
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  passwordCheck(){
    const passwordRegex = /^(?=.*[A-Z])(?=(?:[^a-z]*[a-z]){3})(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z][A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,9}$/;
    return passwordRegex.test(this.password);

  }

  loginWrapper(){
    this.error = "";

    if(!this.passwordCheck()){
      this.error = "Invalid password. It must be 6-10 characters long, start with a letter, and include at least one uppercase letter, three lowercase letters, one number, and one special character.";
    }
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

  login(){
    let user = new User();
    user.username = this.username;
    user.password = this.hashedPassword;
    user.userType = 0;
    this.userService.login(user).subscribe(
      data=>{
        if(data.message != "User with this username has not been found."){
          user = JSON.parse(data.message);
          localStorage.setItem("user", JSON.stringify(user));
          if(user.pendingApproval == 1){
            this.router.navigate(["user-index"]);
          }else{
            this.router.navigate(["status"]);
          }
          
        }else{
          this.error = "Invalid credentials. Please try with another user.";
          this.showErrorModal();
          return;
        }
      }
    );
  }

  changePassword(){
    this.router.navigate(["change-password"]);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
