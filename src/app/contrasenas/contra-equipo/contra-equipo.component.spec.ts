import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraEquipoComponent } from './contra-equipo.component';

describe('ContraEquipoComponent', () => {
  let component: ContraEquipoComponent;
  let fixture: ComponentFixture<ContraEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
