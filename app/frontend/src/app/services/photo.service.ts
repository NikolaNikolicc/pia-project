import { Injectable } from '@angular/core';
import { Message } from '../models/helper/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



interface ImageData {
  name: string;
  blob: string; // base64 string
}

export interface Photo {
  filename: string;
  data: string; // base64 encoded image data
}

interface GetPhotosResponse {
  images: { name: string; blob: string }[];
}


@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  apiUrl = "http://localhost:4000/photos";

  getUserPhoto(username: string) {
    return this.http.post<Blob>(`${this.apiUrl}/getUserPhoto`, { username: username }, { responseType: 'blob' as 'json' });
  }

  getPhotos(company: string, username: string, appointmentId: string): Observable<Photo[]> {
    const url = `${this.apiUrl}/getPhotos`;
    return this.http.post<GetPhotosResponse>(url, { company, username, appointmentId })
        .pipe(
            map((response: GetPhotosResponse) => response.images.map(img => ({
                filename: img.name,
                data: img.blob
            })))
        );
}


  decodeBase64ToBlob(base64: string, contentType = 'image/png'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
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
