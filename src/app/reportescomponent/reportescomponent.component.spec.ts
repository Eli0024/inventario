import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportescomponentComponent } from './reportescomponent.component';

describe('ReportescomponentComponent', () => {
  let component: ReportescomponentComponent;
  let fixture: ComponentFixture<ReportescomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportescomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportescomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
