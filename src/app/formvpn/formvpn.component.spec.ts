import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormvpnComponent } from './formvpn.component';

describe('FormvpnComponent', () => {
  let component: FormvpnComponent;
  let fixture: ComponentFixture<FormvpnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormvpnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormvpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
