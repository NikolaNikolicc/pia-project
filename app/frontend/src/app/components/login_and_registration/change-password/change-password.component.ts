import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import * as CryptoJS from 'crypto-js';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

declare var bootstrap: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  error: string = "";
  username: string = "";
  password: string = "";
  hashedPassword: string = "";
  newPassword: string = "";
  retypedNewPassword: string = "";
  showPassword: boolean = false;
  showPassword1: boolean = false;
  showPassword2: boolean = false;
  user: User = new User();
  message: string = "You have succesfully changed password!";

  constructor(private router: Router, private userService: UserService, public sharedVariablesService: SharedVariablesService){

  }

  ngOnInit(): void {
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  showSuccessModal(msg: string){
    this.message = msg;
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  passwordCheck(pass: string){
    const passwordRegex = /^(?=.*[A-Z])(?=(?:[^a-z]*[a-z]){3})(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z][A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,9}$/;
    return passwordRegex.test(pass);

  }

  backToLogin(){
    if(this.sharedVariablesService.sessionID == '0'){
      this.router.navigate(["login"])
    }else{
      this.router.navigate(["admin"])
    }
  }

  changePassword(){
    this.error = "";

    if(this.newPassword != this.retypedNewPassword){
      this.error = "You must retype the new password exactly as entered in the new password field.";
    }

    if(this.newPassword == this.password){
      this.error = "New password can't be the same as the previous one.";
    }

    if(!this.passwordCheck(this.newPassword)){
      this.error = "Invalid new password. It must be 6-10 characters long, start with a letter, and include at least one uppercase letter, three lowercase letters, one number, and one special character.";
    }
    if(this.newPassword == ""){
      this.error = "New password field is empty.";
    }

    if(!this.passwordCheck(this.password)){
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
    this.user = new User();
    this.user.username = this.username;
    this.user.password = this.hashedPassword;
    this.user.userType = (this.sharedVariablesService.sessionID == "0")? 0 : 1;
    this.userService.login(this.user).subscribe(
      data=>{
        if(data.message != "User with this username has not been found."){
          this.user = JSON.parse(data.message);
          
          // first you need to change password
          this.user.password = this.hashSHA256(this.newPassword);
          localStorage.setItem("user", JSON.stringify(this.user));
          this.userService.changePassword(this.user).subscribe(
            data=>{
              if(data.message == "ok"){
                this.showSuccessModal("You have succesfully changed password!")
              }else{
                this.error = "Error while changing password, please try again.";
                this.showErrorModal();
                return;
              }
            }
          );
          
        }else{
          this.error = "Invalid credentials. Please try with another one.";
          this.showErrorModal();
          return;
        }
      }
    );
  }

  goToLogin(){
    if(this.user.userType == 0){
      this.router.navigate(["login"]);
    }else{
      this.router.navigate(["admin"]);
    }
  }

  togglePasswordVisibility(pos: number) {
    if(pos == 0)this.showPassword = !this.showPassword;
    if(pos == 1)this.showPassword1 = !this.showPassword1;
    if(pos == 2)this.showPassword2 = !this.showPassword2;
  }
}
