import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormimpreComponent } from './formimpre.component';

describe('FormimpreComponent', () => {
  let component: FormimpreComponent;
  let fixture: ComponentFixture<FormimpreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormimpreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormimpreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
