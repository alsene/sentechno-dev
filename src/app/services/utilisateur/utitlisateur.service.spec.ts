import { TestBed } from '@angular/core/testing';

import { UtitlisateurService } from './utitlisateur.service';

describe('UtitlisateurService', () => {
  let service: UtitlisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtitlisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
