import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloTypeProduitComponent } from './silo-type-produit.component';

describe('SiloTypeProduitComponent', () => {
  let component: SiloTypeProduitComponent;
  let fixture: ComponentFixture<SiloTypeProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiloTypeProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiloTypeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

