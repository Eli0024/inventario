import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormapaComponent } from './formapa.component';

describe('FormapaComponent', () => {
  let component: FormapaComponent;
  let fixture: ComponentFixture<FormapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
