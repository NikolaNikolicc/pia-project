import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {

  sessionID: string = "";
  private addressSource = new BehaviorSubject<string>(''); // Default value can be empty or any initial address
  address$ = this.addressSource.asObservable();

  constructor() { }

  get address(): string {
    return this.addressSource.value;
  }

  set address(newAddress: string) {
    this.addressSource.next(newAddress);
  }

}
