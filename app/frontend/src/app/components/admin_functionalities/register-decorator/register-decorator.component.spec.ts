import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDecoratorComponent } from './register-decorator.component';

describe('RegisterDecoratorComponent', () => {
  let component: RegisterDecoratorComponent;
  let fixture: ComponentFixture<RegisterDecoratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterDecoratorComponent]
    });
    fixture = TestBed.createComponent(RegisterDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
