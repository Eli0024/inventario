import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraSiesaComponent } from './contra-siesa.component';

describe('ContraSiesaComponent', () => {
  let component: ContraSiesaComponent;
  let fixture: ComponentFixture<ContraSiesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraSiesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraSiesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
