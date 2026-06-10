import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFulmineComponent } from './produit-fulmine.component';

describe('ProduitFulmineComponent', () => {
  let component: ProduitFulmineComponent;
  let fixture: ComponentFixture<ProduitFulmineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitFulmineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitFulmineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
