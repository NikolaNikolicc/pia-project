import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/helper/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  apiUrl: string = "http://localhost:4000/users";
  
  getInfoForThisUsernames(usernames: string[]) {
    return this.http.post<Message>(`${this.apiUrl}/getInfoForThisUsernames`, {usernames: JSON.stringify(usernames)});
  }
  saveProfileUpdate(tmpUser: User) {
    return this.http.post<Message>(`${this.apiUrl}/saveProfileUpdate`, {user: JSON.stringify(tmpUser)});
  }
  updateUserStatus(tmpUser: User) {
    return this.http.post<Message>(`${this.apiUrl}/updateUserStatus`, {user: JSON.stringify(tmpUser)});
  }
  getAllPendingUsers(){
    return this.http.post<Message>(`${this.apiUrl}/getAllPendingUsers`, null);
  }
  getAllOwners(){
    return this.http.post<Message>(`${this.apiUrl}/getAllOwners`, null);
  }
  getAllDecorators(){
    return this.http.post<Message>(`${this.apiUrl}/getAllDecorators`, null);
  }
  changePassword(user: User) {
    return this.http.post<Message>(`${this.apiUrl}/changePassword`, user);
  }
  login(user: User) {
    return this.http.post<Message>(`${this.apiUrl}/login`, user);
  }
  getUserByUsername(username: string) {
    const data ={
      username: username,
    }
    return this.http.post<Message>(`${this.apiUrl}/getUserByUsername`,
      data);
  }
  getUserByEmail(email: string) {
    const data ={
      email: email,
    }
    return this.http.post<Message>(`${this.apiUrl}/getUserByEmail`,
      data);
  }
  register(user: User){
    return this.http.post<Message>(`${this.apiUrl}/saveUser`,
      user);
  }

  constructor(private http: HttpClient) { }
}
