import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualiteProduitComponent } from './qualite-produit.component';

describe('QualiteProduitComponent', () => {
  let component: QualiteProduitComponent;
  let fixture: ComponentFixture<QualiteProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualiteProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualiteProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
