import { Component, OnInit } from '@angular/core';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{

  constructor(public sharedVariablesService: SharedVariablesService){

  }
  ngOnInit(): void {
    this.sharedVariablesService.sessionID = '0';
  }

}
