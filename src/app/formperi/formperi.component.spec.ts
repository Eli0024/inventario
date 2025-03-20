import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormperiComponent } from './formperi.component';

describe('FormperiComponent', () => {
  let component: FormperiComponent;
  let fixture: ComponentFixture<FormperiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormperiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormperiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
