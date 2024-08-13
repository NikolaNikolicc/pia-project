import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GardenBookingComponent } from './garden-booking.component';

describe('GardenBookingComponent', () => {
  let component: GardenBookingComponent;
  let fixture: ComponentFixture<GardenBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GardenBookingComponent]
    });
    fixture = TestBed.createComponent(GardenBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
