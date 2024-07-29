import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';

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
  showPassword: boolean = false;

  constructor(private router: Router, public sessionService: SessionIDsharedService){

  }

  ngOnInit(): void {
    this.sessionService.sessionID = '0';
  }

  passwordCheck(){
    const passwordRegex = /^(?=.*[A-Z])(?=(?:[^a-z]*[a-z]){3})(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z][A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,9}$/;
    return passwordRegex.test(this.password);

  }

  login(){
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
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
      return;
    }

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
