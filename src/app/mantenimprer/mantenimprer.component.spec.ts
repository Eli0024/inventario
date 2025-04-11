import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimprerComponent } from './mantenimprer.component';

describe('MantenimprerComponent', () => {
  let component: MantenimprerComponent;
  let fixture: ComponentFixture<MantenimprerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimprerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimprerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
