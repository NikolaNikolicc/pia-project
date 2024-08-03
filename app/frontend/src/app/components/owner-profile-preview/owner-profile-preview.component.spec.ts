import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerProfilePreviewComponent } from './owner-profile-preview.component';

describe('OwnerProfilePreviewComponent', () => {
  let component: OwnerProfilePreviewComponent;
  let fixture: ComponentFixture<OwnerProfilePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerProfilePreviewComponent]
    });
    fixture = TestBed.createComponent(OwnerProfilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
