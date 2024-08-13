import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface GardenBooking {
  dateTime: string;
  gardenArea: number;
  gardenType: string;
  hasPool?: boolean;
  hasGreenery?: boolean;
  hasFountain?: boolean;
  numTables?: number;
  numChairs?: number;
  additionalRequirements?: string;
  selectedService?: string;
}

@Component({
  selector: 'app-garden-booking',
  templateUrl: './garden-booking.component.html',
  styleUrls: ['./garden-booking.component.css']
})
export class GardenBookingComponent {
  booking: GardenBooking = {
    dateTime: '',
    gardenArea: 0,
    gardenType: '',
    hasPool: false,
    hasGreenery: false,
    hasFountain: false,
    numTables: 0,
    numChairs: 0,
    additionalRequirements: '',
    selectedService: ''
  };

  currentStep: number = 1;

  constructor(private router: Router) {}

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    console.log('Booking details:', this.booking);
    // Here you would typically send this.booking to your backend service
    // Example:
    // this.gardenBookingService.submitBooking(this.booking).subscribe(...);
    alert('Booking submitted successfully!');
    this.router.navigate(['/admin-index']); // Redirect to the admin index page
  }
}
