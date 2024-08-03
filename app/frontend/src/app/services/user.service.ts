import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  apiUrl: string = "http://localhost:4000";
  
  updateUserStatus(tmpUser: User) {
    return this.http.post<Message>(`${this.apiUrl}/users/updateUserStatus`, {user: JSON.stringify(tmpUser)});
  }
  getAllPendingUsers(){
    return this.http.post<Message>(`${this.apiUrl}/users/getAllPendingUsers`, null);
  }
  changePassword(user: User) {
    return this.http.post<Message>(`${this.apiUrl}/users/changePassword`, user);
  }
  login(user: User) {
    return this.http.post<Message>(`${this.apiUrl}/users/login`, user);
  }
  getUserByUsername(username: string) {
    const data ={
      username: username,
    }
    return this.http.post<Message>(`${this.apiUrl}/users/getUserByUsername`,
      data);
  }
  getUserByEmail(email: string) {
    const data ={
      email: email,
    }
    return this.http.post<Message>(`${this.apiUrl}/users/getUserByEmail`,
      data);
  }

  constructor(private http: HttpClient) { }

  register(user: User){
    return this.http.post<Message>(`${this.apiUrl}/users/saveUser`,
      user);
  }
}
