import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormequipoComponent } from './formequipo.component';

describe('FormequipoComponent', () => {
  let component: FormequipoComponent;
  let fixture: ComponentFixture<FormequipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormequipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormequipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
