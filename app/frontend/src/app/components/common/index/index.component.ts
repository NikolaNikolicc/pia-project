import { Component, OnInit } from '@angular/core';
import { SessionIDsharedService } from 'src/app/services/session-idshared.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{

  constructor(public sessionService: SessionIDsharedService){

  }
  ngOnInit(): void {
    this.sessionService.sessionID = '0';
  }

}
