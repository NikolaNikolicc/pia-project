import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/helper/message';

@Injectable({
  providedIn: 'root'
})
export class DecoratorService {

  apiUrl: string = "http://localhost:4000/decorators";

  saveDecorator(username: string){
    const data ={
      userId: username,
      companyId: ""
    }
    return this.http.post<Message>(`${this.apiUrl}/saveDecorator`,
      data);
  }

  getAllUnemployedDecorators(){
    return this.http.post<Message>(`${this.apiUrl}/getAllUnemployedDecorators`,
      null);
  }

  setCompanyForDecorators(decoratorNames: string[], companyName: string){
    return this.http.post<Message>(`${this.apiUrl}/setCompanyForDecorators`,
      {decoratorNames: decoratorNames, companyName: companyName});
  }

  constructor(private http: HttpClient) { }
}
