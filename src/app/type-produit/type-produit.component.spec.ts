import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProduitComponent } from './type-produit.component';

describe('TypeProduitComponent', () => {
  let component: TypeProduitComponent;
  let fixture: ComponentFixture<TypeProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
