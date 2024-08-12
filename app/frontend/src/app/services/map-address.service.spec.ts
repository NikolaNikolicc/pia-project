import { TestBed } from '@angular/core/testing';

import { MapAddressService } from './map-address.service';

describe('MapAddressService', () => {
  let service: MapAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
