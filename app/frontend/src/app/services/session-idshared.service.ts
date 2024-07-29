import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionIDsharedService {
  sessionID: string = "";

  constructor() { }
}
