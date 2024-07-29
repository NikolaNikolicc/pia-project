import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  changePassword(user: User) {
    return this.http.post<Message>("http://localhost:4000/users/changePassword", user);
  }
  login(user: User) {
    return this.http.post<Message>("http://localhost:4000/users/login", user);
  }
  getUserByUsername(username: string) {
    const data ={
      username: username,
    }
    return this.http.post<Message>("http://localhost:4000/users/getUserByUsername",
      data);
  }
  getUserByEmail(email: string) {
    const data ={
      email: email,
    }
    return this.http.post<Message>("http://localhost:4000/users/getUserByEmail",
      data);
  }

  constructor(private http: HttpClient) { }

  register(user: User){
    return this.http.post<Message>("http://localhost:4000/users/saveUser",
      user);
  }
}
