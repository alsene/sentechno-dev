import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitTableauBordComponent } from './produit-tableau-bord.component';

describe('ProduitTableauBordComponent', () => {
  let component: ProduitTableauBordComponent;
  let fixture: ComponentFixture<ProduitTableauBordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitTableauBordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitTableauBordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
