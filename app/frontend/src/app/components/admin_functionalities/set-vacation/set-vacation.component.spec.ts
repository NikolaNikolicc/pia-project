import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetVacationComponent } from './set-vacation.component';

describe('SetVacationComponent', () => {
  let component: SetVacationComponent;
  let fixture: ComponentFixture<SetVacationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetVacationComponent]
    });
    fixture = TestBed.createComponent(SetVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
