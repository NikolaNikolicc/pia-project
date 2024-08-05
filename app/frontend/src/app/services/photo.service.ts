import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  apiUrl = "http://localhost:4000/photos";

  getUserPhoto(username: string) {
    return this.http.post<Blob>(`${this.apiUrl}/getUserPhoto`, { username: username }, { responseType: 'blob' as 'json' });
  }

  savePhoto(imageBlob: Blob, imageName: string, username: string) {
    const formData: FormData = new FormData();
    formData.append('imageBlob', imageBlob, imageName);
    formData.append('imageName', imageName);
    formData.append('username', username);

    return this.http.post<Message>(`${this.apiUrl}/savePhoto`, formData);
  }

  constructor(private http: HttpClient) { }
}
