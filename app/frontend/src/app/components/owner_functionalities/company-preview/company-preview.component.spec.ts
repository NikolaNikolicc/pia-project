import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPreviewComponent } from './company-preview.component';

describe('CompanyPreviewComponent', () => {
  let component: CompanyPreviewComponent;
  let fixture: ComponentFixture<CompanyPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyPreviewComponent]
    });
    fixture = TestBed.createComponent(CompanyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
