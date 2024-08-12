import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SharedVariablesService } from 'src/app/services/shared-variables.service';

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.css']
})
export class MapPreviewComponent implements OnInit{

  mapUrl: SafeUrl = "";
  private addressSubscription!: Subscription;

  constructor(public sharedVariablesService: SharedVariablesService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.addressSubscription = this.sharedVariablesService.address$.subscribe(newAddress => {
      this.initialize(newAddress);
    });
  }

  initialize(newAddress: string): void {
    this.updateMapWithAddress(newAddress);
  }

  updateMapWithAddress(newAddress: string): void {
    this.geocodeAddress(newAddress).then(coords => {
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generateMapUrl(coords.lat, coords.lon));
    }).catch(error => {
      console.error('Error geocoding address:', error);
    });
  }

  private generateMapUrl(lat: number, lon: number): string {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
  }

  private async geocodeAddress(address: string): Promise<{ lat: number, lon: number }> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error('Address not found');
    }
  }
}
