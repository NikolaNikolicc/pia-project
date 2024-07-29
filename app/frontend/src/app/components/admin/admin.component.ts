import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{

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


}
