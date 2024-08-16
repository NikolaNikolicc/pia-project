import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { Message } from '../models/helper/message';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../models/helper/appointment';

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
  updateAppointment(app: Appointment, comp: string){
    return this.http.post<Message>(`${this.apiUrl}/updateAppointment`,
      {appointment: JSON.stringify(app), company: comp});
  }

  constructor(private http: HttpClient) { }
}
