import { TestBed } from '@angular/core/testing';

import { SiloTypeProduitService } from './silo-type-produit.service';

describe('SiloTypeProduitService', () => {
  let service: SiloTypeProduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiloTypeProduitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

