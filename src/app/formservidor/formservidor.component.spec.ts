import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormservidorComponent } from './formservidor.component';

describe('FormservidorComponent', () => {
  let component: FormservidorComponent;
  let fixture: ComponentFixture<FormservidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormservidorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormservidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
