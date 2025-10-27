import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraAntivirusComponent } from './contra-antivirus.component';

describe('ContraAntivirusComponent', () => {
  let component: ContraAntivirusComponent;
  let fixture: ComponentFixture<ContraAntivirusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraAntivirusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraAntivirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
