import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacadeProduitComponent } from './facade-produit.component';

describe('FacadeProduitComponent', () => {
  let component: FacadeProduitComponent;
  let fixture: ComponentFixture<FacadeProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacadeProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacadeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
