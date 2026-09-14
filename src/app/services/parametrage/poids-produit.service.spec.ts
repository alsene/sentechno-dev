import { TestBed } from '@angular/core/testing';

import { PoidsProduitService } from './poids-produit.service';

describe('PoidsProduitService', () => {
  let service: PoidsProduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoidsProduitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

