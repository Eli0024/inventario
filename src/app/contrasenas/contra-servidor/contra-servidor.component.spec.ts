import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraServidorComponent } from './contra-servidor.component';

describe('ContraServidorComponent', () => {
  let component: ContraServidorComponent;
  let fixture: ComponentFixture<ContraServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraServidorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
