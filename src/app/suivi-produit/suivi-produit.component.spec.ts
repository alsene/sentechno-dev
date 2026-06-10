import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviProduitComponent } from './suivi-produit.component';

describe('SuiviProduitComponent', () => {
  let component: SuiviProduitComponent;
  let fixture: ComponentFixture<SuiviProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
