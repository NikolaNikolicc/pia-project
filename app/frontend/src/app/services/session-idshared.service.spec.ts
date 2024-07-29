import { TestBed } from '@angular/core/testing';

import { SessionIDsharedService } from './session-idshared.service';

describe('SessionIDsharedService', () => {
  let service: SessionIDsharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionIDsharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
