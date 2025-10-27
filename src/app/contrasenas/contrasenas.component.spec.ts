import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrasenasComponent } from './contrasenas.component';

describe('ContrasenasComponent', () => {
  let component: ContrasenasComponent;
  let fixture: ComponentFixture<ContrasenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContrasenasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContrasenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
