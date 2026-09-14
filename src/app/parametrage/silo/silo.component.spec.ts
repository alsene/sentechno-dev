import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiloComponent } from './silo.component';

describe('SiloComponent', () => {
  let component: SiloComponent;
  let fixture: ComponentFixture<SiloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
