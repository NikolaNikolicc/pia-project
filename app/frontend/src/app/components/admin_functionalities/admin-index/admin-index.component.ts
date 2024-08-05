import { Component, OnInit } from '@angular/core';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit{

  constructor(public sessionService: SessionIDsharedService){

  }

  ngOnInit(): void {
    this.sessionService.sessionID = '1';
  }

}
