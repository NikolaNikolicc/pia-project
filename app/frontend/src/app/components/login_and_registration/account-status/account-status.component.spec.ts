import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatusComponent } from './account-status.component';

describe('AccountStatusComponent', () => {
  let component: AccountStatusComponent;
  let fixture: ComponentFixture<AccountStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountStatusComponent]
    });
    fixture = TestBed.createComponent(AccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
