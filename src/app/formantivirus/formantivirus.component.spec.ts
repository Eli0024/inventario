import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormantivirusComponent } from './formantivirus.component';

describe('FormantivirusComponent', () => {
  let component: FormantivirusComponent;
  let fixture: ComponentFixture<FormantivirusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormantivirusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormantivirusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
