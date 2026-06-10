import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotProduitComponent } from './lot-produit.component';

describe('LotProduitComponent', () => {
  let component: LotProduitComponent;
  let fixture: ComponentFixture<LotProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
