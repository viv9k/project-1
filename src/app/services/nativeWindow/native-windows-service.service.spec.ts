import { TestBed } from '@angular/core/testing';

import { NativeWindowsServiceService } from './native-windows-service.service';

describe('NativeWindowsServiceService', () => {
  let service: NativeWindowsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeWindowsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
