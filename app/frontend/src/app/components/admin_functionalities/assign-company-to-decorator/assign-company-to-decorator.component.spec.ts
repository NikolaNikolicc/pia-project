import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCompanyToDecoratorComponent } from './assign-company-to-decorator.component';

describe('AssignCompanyToDecoratorComponent', () => {
  let component: AssignCompanyToDecoratorComponent;
  let fixture: ComponentFixture<AssignCompanyToDecoratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignCompanyToDecoratorComponent]
    });
    fixture = TestBed.createComponent(AssignCompanyToDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
