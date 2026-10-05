import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationLotComponent } from './station-lot.component';

describe('StationLotComponent', () => {
  let component: StationLotComponent;
  let fixture: ComponentFixture<StationLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationLotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


