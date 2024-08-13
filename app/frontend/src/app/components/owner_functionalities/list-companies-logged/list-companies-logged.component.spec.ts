import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompaniesLoggedComponent } from './list-companies-logged.component';

describe('ListCompaniesLoggedComponent', () => {
  let component: ListCompaniesLoggedComponent;
  let fixture: ComponentFixture<ListCompaniesLoggedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCompaniesLoggedComponent]
    });
    fixture = TestBed.createComponent(ListCompaniesLoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
