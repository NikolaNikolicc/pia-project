import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { Message } from '../models/helper/message';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  apiUrl: string = "http://localhost:4000/companies";

  saveCompany(company: Company){
    return this.http.post<Message>(`${this.apiUrl}/saveCompany`,
      {company: company});
  }
  getCompanyByName(companyName: string){
    return this.http.post<Message>(`${this.apiUrl}/getCompanyByName`,
      {companyName: companyName});
  }
  getAllCompanies(){
    return this.http.post<Message>(`${this.apiUrl}/getAllCompanies`,
      null);
  }

  constructor(private http: HttpClient) { }
}
