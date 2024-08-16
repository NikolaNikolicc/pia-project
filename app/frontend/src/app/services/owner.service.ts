import { Injectable } from '@angular/core';
import { Appointment } from '../models/helper/appointment';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/helper/message';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  apiUrl = "http://localhost:4000/owners";

  createAppointment(appointment: Appointment, companyName: string) {
    return this.http.post<Message>(`${this.apiUrl}/createAppointment`, {appointment: JSON.stringify(appointment), company: companyName});
  }

  constructor(private http: HttpClient) { }
}
