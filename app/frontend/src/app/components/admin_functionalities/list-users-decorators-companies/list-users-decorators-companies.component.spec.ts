import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersDecoratorsCompaniesComponent } from './list-users-decorators-companies.component';

describe('ListUsersDecoratorsCompaniesComponent', () => {
  let component: ListUsersDecoratorsCompaniesComponent;
  let fixture: ComponentFixture<ListUsersDecoratorsCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListUsersDecoratorsCompaniesComponent]
    });
    fixture = TestBed.createComponent(ListUsersDecoratorsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
