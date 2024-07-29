import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class PhotoSendService {
  savePhoto(imageBlob: Blob, imageName: string, username: string) {
    const formData: FormData = new FormData();
    formData.append('imageBlob', imageBlob, imageName);
    formData.append('imageName', imageName);
    formData.append('username', username);

    return this.http.post<Message>("http://localhost:4000/photos/savePhoto", formData);
  }

  constructor(private http: HttpClient) { }
}
