import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueProduitComponent } from './historique-produit.component';

describe('HistoriqueProduitComponent', () => {
  let component: HistoriqueProduitComponent;
  let fixture: ComponentFixture<HistoriqueProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
