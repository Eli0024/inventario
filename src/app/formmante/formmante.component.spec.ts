import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormmanteComponent } from './formmante.component';

describe('FormmanteComponent', () => {
  let component: FormmanteComponent;
  let fixture: ComponentFixture<FormmanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormmanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormmanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
