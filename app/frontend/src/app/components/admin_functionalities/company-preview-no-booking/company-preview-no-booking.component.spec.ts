import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPreviewNoBookingComponent } from './company-preview-no-booking.component';

describe('CompanyPreviewNoBookingComponent', () => {
  let component: CompanyPreviewNoBookingComponent;
  let fixture: ComponentFixture<CompanyPreviewNoBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyPreviewNoBookingComponent]
    });
    fixture = TestBed.createComponent(CompanyPreviewNoBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
