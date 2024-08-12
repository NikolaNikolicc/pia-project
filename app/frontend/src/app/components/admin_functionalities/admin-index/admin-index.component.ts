import { Component, OnInit } from '@angular/core';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-admin-index',
  templateUrl: './admin-index.component.html',
  styleUrls: ['./admin-index.component.css']
})
export class AdminIndexComponent implements OnInit{

  constructor(public sharedVariablesService: SharedVariablesService){

  }

  ngOnInit(): void {
    this.sharedVariablesService.sessionID = '1';
  }

}
