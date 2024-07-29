import { TestBed } from '@angular/core/testing';

import { PhotoSendService } from './photo-send.service';

describe('PhotoSendService', () => {
  let service: PhotoSendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoSendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
