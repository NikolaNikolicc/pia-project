import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';
import { Appointment } from 'src/app/models/helper/appointment';
import { CompanyService } from 'src/app/services/company.service';
import { PhotoService, Photo } from 'src/app/services/photo.service';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent implements OnInit {

  companies: Company[] = [];
  finishedAppointments: Appointment[] = [];
  finishedAppointmentsCompany: string[] = [];
  photosToShow: { company: string, appointment: Appointment, photos: Photo[] }[] = [];
  counter: number = 0;
  NUM_OF_DECORATORATED_PREVIEW: number = 3;

  constructor(
    private photoService: PhotoService,
    private companyService: CompanyService,
  ) {}

  ngOnInit(): void {
    this.companyService.getAllCompanies().subscribe(
      cmpns => {
        if (cmpns.message) {
          this.companies = JSON.parse(cmpns.message);
          this.loadPhotos();
        }
      }
    );
  }

  getImageType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'png':
        return 'png';
      case 'jpg':
      case 'jpeg':
        return 'jpeg';
      default:
        return 'jpeg'; // Default to jpeg if extension is unknown
    }
  }
  
  private loadPhotos(): void {
    for (const company of this.companies) {
      for (const appointment of company.appointments) {
        if (appointment.status === "confirmed" && new Date(appointment.datetimeFinished) < new Date() && appointment.photosUploaded) {
          this.photoService.getPhotos(company.name, appointment.decoratorID, appointment.appointmentId.toString()).subscribe(
            photos => {
              if (photos.length === 0) {
                this.counter--;
              } else {
                this.finishedAppointments.push(appointment);
                this.finishedAppointmentsCompany.push(company.name);
                this.photosToShow.push({ company: company.name, appointment, photos: photos as Photo[] });

                this.counter++;
  
                // Log each photo's data to inspect it
                photos.forEach(photo => console.log(`Photo: ${photo.filename}, Data: ${photo.data.substring(0, 100)}...`));
              }
  
              if (this.counter === this.NUM_OF_DECORATORATED_PREVIEW) {
                return;
              }
            },
            error => {
              console.error('Error fetching photos:', error);
              this.counter--;  // Adjust counter in case of an error
            }
          );
  
          if (this.counter === this.NUM_OF_DECORATORATED_PREVIEW) {
            return;
          }
        }
      }
    }
  }
  
}
