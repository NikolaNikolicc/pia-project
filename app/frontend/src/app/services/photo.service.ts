import { Injectable } from '@angular/core';
import { Message } from '../models/helper/message';
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

  savePhotos(imageBlobs: Blob[], imageNames: string[], company: string, username: string, appointmentId: number) {
    const formData = new FormData();

    imageBlobs.forEach((blob, index) => {
      formData.append('images', blob, imageNames[index]);
    });

    formData.append('imageNames', JSON.stringify(imageNames)); // Ensure this is correctly serialized if it's an array
    formData.append('company', company);
    formData.append('username', username);
    formData.append('appointmentId', appointmentId.toString());

    return this.http.post<Message>(`${this.apiUrl}/savePhotos`, formData);

  }

  constructor(private http: HttpClient) { }
}
