import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { User } from 'src/app/models/user';
import { PhotoService } from 'src/app/services/photo.service';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';
import { UserService } from 'src/app/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-owner-profile-preview',
  templateUrl: './owner-profile-preview.component.html',
  styleUrls: ['./owner-profile-preview.component.css']
})
export class OwnerProfilePreviewComponent implements OnInit{

  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('successModal') modalSuccess!: ElementRef;
  usr: User = new User();
  error: string = "";
  imageBlob!: Blob;
  imageName: string = "";
  imageUrl!: SafeUrl;
  // credit card validation 
  creditCardType: string = "";
  success: string = "";

  editMode = { 
    name: false,
    surname: false,
    address: false,
    phone: false,
    email: false,
    creditCard: false
  };

  editName: string = '';
  editSurname: string = '';
  editAddress: string = '';
  editPhone: string = '';
  editEmail: string = '';
  editCreditCard: string = '';

  constructor(private photoService: PhotoService, private userService: UserService, public sharedVariablesService: SharedVariablesService){

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

  ngOnInit(): void {
    const u = localStorage.getItem("user");
    if (u != null){
      this.usr = JSON.parse(u);
    }

    this.editCreditCard = this.usr.creditCard;
    this.creditCardTypeCheck();

    if(this.usr.profilePicture){
      this.photoService.getUserPhoto(this.usr.username).subscribe(
        data=>{
          this.imageBlob = data;
          this.usr.imgPath = URL.createObjectURL(this.imageBlob);
        }
      );
    }else{
      this.photoService.getUserPhoto("default").subscribe(
        data=>{
          this.imageBlob = data
          this.usr.imgPath = URL.createObjectURL(this.imageBlob);
        }
      );
    }
  }

  toggleEdit(field: keyof typeof this.editMode) {
    this.editMode[field] = !this.editMode[field];
    if (this.editMode[field]) {
      (this as any)[`edit${this.capitalizeFirstLetter(field)}`] = this.usr[field];
    }
  }

  creditCardCheck() {
    const combinedRegex = /^(?:(300|301|302|303|36|38)\d{12}|(51|52|53|54|55)\d{14}|(4539|4556|4916|4532|4929|4485|4716)\d{12})$/;
    return combinedRegex.test(this.editCreditCard);
  }

  creditCardTypeCheck() {
    const dinersRegex = /^(?=^\d{0,15}$)(300|301|302|303|36|38)/;
    const masterCardRegex = /^(?=^\d{0,16}$)(51|52|53|54|55)/;
    const visaRegex = /^(?=^\d{0,16}$)(4539|4556|4916|4532|4929|4485|4716)/;

    if (dinersRegex.test(this.editCreditCard)) {
      this.creditCardType = 'diners';
    } else if (masterCardRegex.test(this.editCreditCard)) {
      this.creditCardType = 'master';
    } else if (visaRegex.test(this.editCreditCard)) {
      this.creditCardType = 'visa';
    } else {
      this.creditCardType = 'unknown';
    }
  }

  emailFormatCheck() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.editEmail);
  }

  emailUniquenessCheck(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getUserByEmail(this.editEmail).subscribe(
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

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\/\s]*$/;
    return phoneRegex.test(phone);
  }

  async saveWrapper(field: keyof typeof this.editMode){
    this.error = "";

    if(field == "phone"){
      if(!this.validatePhone(this.editPhone)){
        this.error = "Phone number can only contain digits and the following special symbols: \\ - / and space"
      }
      if(this.editPhone == ""){
        this.error = "Phone field is empty."
      }
    }
    if(field == "email"){
      const isEmailUnique = await this.emailUniquenessCheck();
      if (!isEmailUnique) {
        this.error = "This email has already been used. Please try with another one.";
      }
  
      if (!this.emailFormatCheck()) {
        this.error = "Invalid email address. Please ensure it contains an '@' character and a domain (e.g., example.com).";
      }
  
      if (this.editEmail == "") {
        this.error = "Email field is empty.";
      }
    }
    if(field == "creditCard"){
      if (!this.creditCardCheck()) {
        this.error = "Invalid credit card number. The card must be one of the following types: Diners Club (15 digits), MasterCard (16 digits), or Visa (16 digits).";
      }
      if (this.editCreditCard == "") {
        this.error = "Credit card field is empty.";
      }
    }

    if(field == "address"){
      if(this.editAddress == ""){
        this.error = "Address field is empty.";
      }
    }

    if(field == "name"){
      if(this.editName == ""){
        this.error = "Name field is empty.";
      }
    }

    if(field == "surname"){
      if(this.editSurname == ""){
        this.error = "Surname field is empty.";
      }
    }

    if(this.error != ""){
      this.showErrorModal();
      return;
    }

    this.save(field);
  }

  save(field: keyof typeof this.editMode) {
    this.usr[field] = (this as any)[`edit${this.capitalizeFirstLetter(field)}`];
    localStorage.setItem("user", JSON.stringify(this.usr))
    // TODO update user on server side 
    this.editMode[field] = false;
    this.userService.saveProfileUpdate(this.usr).subscribe(
      data=>{
        if(data.message == "ok"){
          this.success = "You succesfully updated your profile's " + field;
          this.showSuccessModal();
        }else{
          this.error = "Something went wrong, please try update once again.";
          this.showErrorModal();
        }
      }
    );
  }

  cancelEdit(field: keyof typeof this.editMode) {
    this.editMode[field] = false;
    (this as any)[`edit${this.capitalizeFirstLetter(field)}`] = this.usr[field];
    // this is needed because of icon representation of credit card type
    if(field == "creditCard"){
      this.editCreditCard = this.usr.creditCard;
      this.creditCardTypeCheck();
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
          this.imageUrl = "../../assets/defaultUser.jpg";
          return;
        }
      }

      this.usr.imgPath = URL.createObjectURL(this.imageBlob);

      this.photoService.savePhoto(this.imageBlob, this.imageName, this.usr.username).subscribe(
        data=>{
          if(data.message == "ok"){
            this.success = "You succesfully updated your profile photo.";
            this.showSuccessModal();
          }else{
            this.error = "Something went wrong, please update photo once again.";
            this.showErrorModal();
          }
        }
      )
    }
  }

}
