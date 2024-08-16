import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
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
  userType: string = "";
  showPassword: boolean = false;
  company: Company = new Company();
  decorator: Decorator = new Decorator();

  constructor(private router: Router, public sharedVariablesService: SharedVariablesService, private userService: UserService, private decoratorService: DecoratorService, private companyService: CompanyService){

  }

  ngOnInit(): void {
    this.sharedVariablesService.sessionID = '0';
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

  isDateDifferenceBiggerThan24h(date: Date){
    let timeNow = new Date().getTime()
    let timeFinished = new Date(date).getTime()
    return timeNow - timeFinished >= 24 * 60 * 60 * 1000
  }

  checkIfDecoratorFinishedAllhisJobs(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.decoratorService.getAllEmployedDecorators().subscribe(
        decs => {
          if (decs.message) {
            let decorators: Decorator[] = JSON.parse(decs.message);
            let allJobsFinished = true; // Assume all jobs are finished initially
  
            const decoratorChecks = decorators.map(dec => {
              if (dec.userId === this.username) {
                return new Promise<void>((resolve, reject) => {
                  this.companyService.getCompanyByName(dec.companyId).subscribe(
                    company => {
                      if (company) {
                        this.company = JSON.parse(company.message);
                        this.company.appointments.forEach(appointment => {
                          if (
                            this.isDateDifferenceBiggerThan24h(appointment.datetimeFinished) &&
                            appointment.decoratorID === this.username &&
                            !appointment.photosUploaded
                          ) {
                            allJobsFinished = false; // If any job is unfinished, mark as false
                          }
                        });
                      }
                      resolve(); // Resolve after checking this company
                    },
                    error => reject(error)
                  );
                });
              } else {
                return Promise.resolve(); // Skip this decorator
              }
            });
  
            Promise.all(decoratorChecks).then(() => {
              resolve(allJobsFinished);
            }).catch(error => reject(error));
  
          } else {
            resolve(true); // If no decorators or no message, consider all jobs finished
          }
        },
        error => {
          reject(error); // Reject in case of an error in the outer observable
        }
      );
    });
  }
  

  login(){
    let user = new User();
    user.username = this.username;
    user.password = this.hashedPassword;
    user.userType = parseInt(this.userType);
    this.userService.login(user).subscribe(
      async data=>{
        if(data.message != "User with this username has not been found."){
          user = JSON.parse(data.message);
          // in case database is not working
          if(user.username != this.username){
            this.error = "Invalid credentials. Please try with another user.";
            this.showErrorModal();
            return;
          }
          localStorage.setItem("user", JSON.stringify(user));
          if(user.pendingApproval == 1){
            if(user.userType == 0){
              // owner logged
              this.sharedVariablesService.sessionID = "2";
            }
            if(user.userType == 2){
              // firstly we need to implement check if decorator finished all his jobs on time
              const allJobsFinished = await this.checkIfDecoratorFinishedAllhisJobs();
              if(!allJobsFinished){
                let user = new User();
                user.pendingApproval = 0;
                user.comment = "This decorator hasn't finished all jobs in time(photos aren't uploaded). Contact system admin to reinstantiate your account.";
                this.userService.updateUserStatus(user).subscribe(
                  data=>{
                    localStorage.setItem("user", JSON.stringify(user));
                    this.router.navigate(["status"]);
                    return;
                  }
                )
              }
              // decorator logged
              this.sharedVariablesService.sessionID = "3";
            }
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
