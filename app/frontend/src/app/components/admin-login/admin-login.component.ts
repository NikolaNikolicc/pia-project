import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';

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
  showPassword: boolean = false;

  constructor(public sessionService: SessionIDsharedService){

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


}
