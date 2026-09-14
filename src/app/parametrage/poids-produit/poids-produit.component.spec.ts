import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoidsProduitComponent } from './poids-produit.component';

describe('PoidsProduitComponent', () => {
  let component: PoidsProduitComponent;
  let fixture: ComponentFixture<PoidsProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoidsProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoidsProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

