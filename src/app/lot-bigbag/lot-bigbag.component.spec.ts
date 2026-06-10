import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotBigbagComponent } from './lot-bigbag.component';

describe('LotBigbagComponent', () => {
  let component: LotBigbagComponent;
  let fixture: ComponentFixture<LotBigbagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotBigbagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotBigbagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
