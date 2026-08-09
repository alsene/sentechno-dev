import { TestBed } from '@angular/core/testing';

import { SilotService } from './silot.service';

describe('SilotService', () => {
  let service: SilotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SilotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
