import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { Decorator } from 'src/app/models/decorator';
import { Appointment } from 'src/app/models/helper/appointment';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { DecoratorService } from 'src/app/services/decorator.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css']
})
export class RegistrationRequestsComponent implements OnInit {
  @ViewChild('declineModal') declineModal!: ElementRef;
  @ViewChild('errorModal') modalError!: ElementRef;
  requests: User[] = [];
  images: Blob[] = [];
  defaultUrl: SafeUrl = "";
  reason: string = "";
  tmpUser: User = new User();
  error: string = "";

  constructor(private userService: UserService,
    private photoService: PhotoService,
    private renderer: Renderer2,
    private router: Router,
    private companyService: CompanyService,
    private decoratorService: DecoratorService,
  ) { }

  ngOnInit(): void {
    this.userService.getAllPendingUsers().subscribe(
      data => {
        this.requests = JSON.parse(data.message);
        // get default profile picture
        this.photoService.getUserPhoto("default").subscribe(
          data => {
            this.images.push(data)
            this.defaultUrl = URL.createObjectURL(this.images[0]);
          }
        );
        this.requests.forEach(usr => {
          if (usr.profilePicture) {
            this.photoService.getUserPhoto(usr.username).subscribe(
              data => {
                this.images.push(data)
                usr.imgPath = URL.createObjectURL(this.images[this.images.length - 1]);
              }
            );
          } else {
            usr.imgPath = "default";
          }
        });
      }
    )
  }

  showErrorModal() {
    const modalNative: HTMLElement = this.modalError.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  showDeclineModal() {
    const modalNative: HTMLElement = this.declineModal.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  approveRequest(usr: User) {
    this.reason = "All rights reserved.";
    // if branch is used for changing photos uploaded flag in blocking appointment so decorator can continue using application
    if (usr.blockingAppointment != 0) {
      this.decoratorService.getAllEmployedDecorators().subscribe(
        decorators => {
          if (decorators.message) {
            let parsedDecorators: Decorator[] = JSON.parse(decorators.message);
            parsedDecorators.forEach(decorator => {
              if(decorator.userId == usr.username){
                this.companyService.getCompanyByName(decorator.companyId).subscribe(
                  cmpny=>{
                    if(cmpny.message){
                      let company: Company = JSON.parse(cmpny.message);
                      let appointment: Appointment = company.appointments[usr.blockingAppointment - 1];
                      appointment.photosUploaded = true;
                      this.companyService.updateAppointment(appointment, company.name).subscribe(
                        data=>{
                          if(data.message){
                            this.tmpUser = usr;
                            this.updateUser();
                          }
                        }
                      )
                    }
                  }
                )
              }
            })
          }
        })
    }else{
      this.tmpUser = usr;
      this.updateUser();
    }
  }




  declineRequest(usr: User) {
    this.tmpUser = usr;
    this.showDeclineModal();
  }

  goToAdminIndex() {
    this.router.navigate(["admin-index"]);
  }

  updateUser() {
    if (this.reason == "All rights reserved.") {
      this.tmpUser.pendingApproval = 1;
    } else {
      this.tmpUser.pendingApproval = 2;
    }
    this.tmpUser.comment = this.reason;
    this.tmpUser.blockingAppointment = 0;
    this.userService.updateUserStatus(this.tmpUser).subscribe(
      data => {
        if (data.message == "ok") {
          // remove component with that id from view
          const elementId = this.tmpUser.username;
          const elementToRemove = document.getElementById(elementId);
          if (elementToRemove) {
            this.renderer.removeChild(elementToRemove.parentNode, elementToRemove);
          }
        } else {
          this.error = "Something went wrong, please try again.";
          this.showErrorModal();
        }
      }
    )
  }

}
