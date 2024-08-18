import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GardenMaintenanceComponent } from './garden-maintenance.component';

describe('GardenMaintenanceComponent', () => {
  let component: GardenMaintenanceComponent;
  let fixture: ComponentFixture<GardenMaintenanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GardenMaintenanceComponent]
    });
    fixture = TestBed.createComponent(GardenMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
