import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMantComponent } from './calendar-mant.component';

describe('CalendarMantComponent', () => {
  let component: CalendarMantComponent;
  let fixture: ComponentFixture<CalendarMantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarMantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
