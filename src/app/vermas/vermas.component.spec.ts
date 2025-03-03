import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VermasComponent } from './vermas.component';

describe('VermasComponent', () => {
  let component: VermasComponent;
  let fixture: ComponentFixture<VermasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VermasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VermasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
