import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormoffComponent } from './formoff.component';

describe('FormoffComponent', () => {
  let component: FormoffComponent;
  let fixture: ComponentFixture<FormoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormoffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
