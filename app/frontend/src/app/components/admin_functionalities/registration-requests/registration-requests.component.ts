import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css']
})
export class RegistrationRequestsComponent implements OnInit{
  @ViewChild('declineModal') declineModal!: ElementRef;
  @ViewChild('errorModal') modalError!: ElementRef;
  requests: User[] = [];
  images: Blob[] = [];
  defaultUrl: SafeUrl = "";
  reason: string = "";
  tmpUser: User = new User();
  error: string = "";

  constructor(private userService: UserService, private photoService: PhotoService, private renderer: Renderer2, private router: Router){}
  
  ngOnInit(): void {
    this.userService.getAllPendingUsers().subscribe(
      data=>{
        this.requests = JSON.parse(data.message);
        // get default profile picture
        this.photoService.getUserPhoto("default").subscribe(
          data=>{
            this.images.push(data)
            this.defaultUrl = URL.createObjectURL(this.images[0]);
          }
        );
        this.requests.forEach(usr => {
          if(usr.profilePicture){
            this.photoService.getUserPhoto(usr.username).subscribe(
              data=>{
                this.images.push(data)
                usr.imgPath = URL.createObjectURL(this.images[this.images.length - 1]);
              }
            );
          }else{
            usr.imgPath = "default";
          }
        });
      }
    )
  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  showDeclineModal(){
    const modalNative: HTMLElement = this.declineModal.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  approveRequest(usr: User){
    this.reason = "All rights reserved.";
    this.tmpUser = usr;
    this.updateUser();
  }

  declineRequest(usr: User){
    this.tmpUser = usr;
    this.showDeclineModal();
  }

  goToAdminIndex(){
    this.router.navigate(["admin-index"]);
  }

  updateUser(){
    if(this.reason == "All rights reserved."){
      this.tmpUser.pendingApproval = 1;
    }else{
      this.tmpUser.pendingApproval = 2;
    }
    this.tmpUser.comment = this.reason;
    this.userService.updateUserStatus(this.tmpUser).subscribe(
      data=>{
        if(data.message == "ok"){
          // remove component with that id from view
          const elementId = this.tmpUser.username;
          const elementToRemove = document.getElementById(elementId);
          if (elementToRemove) {
            this.renderer.removeChild(elementToRemove.parentNode, elementToRemove);
          }
        }else{
          this.error = "Something went wrong, please try again.";
          this.showErrorModal();
        }
      }      
    )
  }

}
