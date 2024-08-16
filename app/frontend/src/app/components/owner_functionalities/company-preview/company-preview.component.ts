import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-company-preview',
  templateUrl: './company-preview.component.html',
  styleUrls: ['./company-preview.component.css']
})
export class CompanyPreviewComponent implements OnInit {

  company: Company = new Company();

  constructor(private sharedVariablesService: SharedVariablesService) { }

  ngOnInit(): void {
    const c = localStorage.getItem("company")
    if(c != null){
      this.company = JSON.parse(c)
      this.sharedVariablesService.address = this.company.address;
    }
  }

}
