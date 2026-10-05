import { TestBed } from '@angular/core/testing';

import { StationLotService } from './station-lot.service';

describe('StationLotService', () => {
  let service: StationLotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StationLotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


