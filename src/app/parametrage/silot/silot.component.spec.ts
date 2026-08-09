import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilotComponent } from './silot.component';

describe('SilotComponent', () => {
  let component: SilotComponent;
  let fixture: ComponentFixture<SilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
