import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { DecoratorService } from 'src/app/services/decorator.service';

declare var bootstrap: any;

@Component({
  selector: 'app-register-decorator',
  templateUrl: './register-decorator.component.html',
  styleUrls: ['./register-decorator.component.css']
})
export class RegisterDecoratorComponent {

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  error: string = "";
  success: string = "";
  username: string = "";
  password: string = "";
  hashedPassword: string = "";
  name: string = "";
  surname: string = "";
  gender: string = "male";
  address: string = "";
  phone: string = "";
  email: string = "";
  showPassword: boolean = false;
  imagePreview: string = "../../assets/defaultUser.jpg";
  imageBlob!: Blob;
  imageName: string = "";
  

  constructor(private userService: UserService, private photoSendService: PhotoService, private router: Router, private decoratorService: DecoratorService) {

  }

  showErrorModal(){
    const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  showSuccessModal(){
    const modalNative: HTMLElement = this.modalSuccess.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
  }

  triggerFileInputClick() {
    let fileInput = document.getElementById("photo-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files == null) return;
    if (!input.files.length) return;

    const files = input.files;

    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
    ];

    for (let i = 0; i < files.length; i++) {

      const extension = files[i].name.split('.').pop()?.toLocaleLowerCase();
      if (!extension) continue;
      if (!allowedExtensions.includes(extension!)) {
        this.error = "Choosen photo format is not supported, please try with other formats (ex. jpg, png)";
        const modalNative: HTMLElement = this.modalError.nativeElement;
        const modal = new bootstrap.Modal(modalNative, {
          backdrop: 'static', // Prevents closing when clicking outside
          keyboard: false, // Prevents closing with the escape key
        });
        modal.show();
        return;
      }

      // this.imageName = "profile_picture." + extension;
      this.imageName = extension;
      const blob = new Blob([files[i]], { type: files[i].type });
      this.imageBlob = blob;


      const image = new Image();
      image.src = URL.createObjectURL(this.imageBlob);

      image.onload = () => {
        const width = image.naturalWidth;
        const height = image.naturalHeight;

        if (width < 100 || height < 100 || width > 300 || height > 300) {
          this.error = "Image dimensions must be within 100x100px and 300x300px";
          const modalNative: HTMLElement = this.modalError.nativeElement;
          const modal = new bootstrap.Modal(modalNative, {
            backdrop: 'static', // Prevents closing when clicking outside
            keyboard: false, // Prevents closing with the escape key
          });
          modal.show();
          this.imagePreview = "../../assets/defaultUser.jpg";
          return;
        }
      }

      this.imagePreview = URL.createObjectURL(this.imageBlob);

      // const reader = new FileReader();
      // reader.onload = (e: any) => {
      //   this.imagePreview = e.target.result;
      // };
      // reader.readAsDataURL(blob);
    }
  }

  setImageStyles() {
    return {
      'margin': 'auto', /* Center the card horizontally */
      'overflow': 'hidden', /* Hide overflow to ensure the image fits within the card */
      'max-width': '300px',
      'max-height': '300px'
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordCheck() {
    const passwordRegex = /^(?=.*[A-Z])(?=(?:[^a-z]*[a-z]){3})(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z][A-Za-z\d!@#$%^&*(),.?":{}|<>]{5,9}$/;
    return passwordRegex.test(this.password);

  }

  emailFormatCheck() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  emailUniquenessCheck(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getUserByEmail(this.email).subscribe(
        data => {
          if (data.message == "User with this email has not been found.") {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  usernameUniquenessCheck(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getUserByUsername(this.username).subscribe(
        data => {
          if (data.message == "User with this username has not been found.") {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\/\s]*$/;
    return phoneRegex.test(phone);
  }

  async registerWrapper() {
    this.error = "";

    const isEmailUnique = await this.emailUniquenessCheck();
    if (!isEmailUnique) {
      this.error = "This email has already been used. Please try with another one.";
    }

    if (!this.emailFormatCheck()) {
      this.error = "Invalid email address. Please ensure it contains an '@' character and a domain (e.g., example.com).";
    }

    if (this.email == "") {
      this.error = "Email field is empty.";
    }

    if(!this.validatePhone(this.phone)){
      this.error = "Phone number can only contain digits and the following special symbols: \\ - / and space"
    }

    if (this.phone == "") {
      this.error = "Phone field is empty.";
    }

    if (this.address == "") {
      this.error = "Address field is empty.";
    }

    if (this.surname == "") {
      this.error = "Surname field is empty.";
    }

    if (this.name == "") {
      this.error = "Name field is empty.";
    }

    if (!this.passwordCheck()) {
      this.error = "Invalid password. It must be 6-10 characters long, start with a letter, and include at least one uppercase letter, three lowercase letters, one number, and one special character.";
    }
    if (this.password == "") {
      this.error = "Password field is empty.";
    }

    const isUsernameUnique = await this.usernameUniquenessCheck();
    if (!isUsernameUnique) {
      this.error = "This username has already been used. Please try with another one.";
    }

    // we need this check because our system is using default as directory name for storing default user photo
    if(this.username == "default"){
      this.error = "This username is forbiden for use. Please try with another one.";
    }

    if (this.username == "") {
      this.error = "Username field is empty.";
    }

    if (this.error != "") {
      this.showErrorModal();
      return;
    }
    this.hashedPassword = this.hashSHA256(this.password);
    this.register();
  }

  hashSHA256(value: string): string {
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
  }

  register() {
    let user = new User();
    user.username = this.username;
    user.password = this.hashedPassword;
    user.name = this.name;
    user.surname = this.surname;
    user.gender = this.gender;
    user.address = this.address;
    user.phone = this.phone;
    user.email = this.email;
    user.creditCard = "";
    user.userType = 2; // decorator code
    user.profilePicture = (this.imagePreview == "../../assets/defaultUser.jpg") ? false : true;
    user.pendingApproval = 1; // approved
    user.comment = "All rights reserved.";

    this.userService.register(user).subscribe(
      data => {
        if (data.message == "ok") {
          localStorage.setItem("user", JSON.stringify(user));
          // save decorator infos (company = "", userId = "this.username")
          this.decoratorService.saveDecorator(this.username).subscribe(
            data=>{
              if(data.message == "ok"){
                if (user.profilePicture) {
                  this.photoSendService.savePhoto(this.imageBlob, this.imageName, user.username).subscribe(
                    data => {
                      this.success = "You have succesfully added decorator.";
                      this.showSuccessModal();
                    }
                  );
                }else{
                  this.success = "You have succesfully added decorator.";
                  this.showSuccessModal();
                  
                }
              }else{
                this.error = "Something went wrong, please try again."
                this.showErrorModal();
              }
            }
          )
          
        }
      }
    )
  }

  goToAdminIndex(){
    this.router.navigate(["admin-index"]);
  }

}
