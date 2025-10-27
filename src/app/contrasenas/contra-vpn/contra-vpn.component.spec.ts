import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraVpnComponent } from './contra-vpn.component';

describe('ContraVpnComponent', () => {
  let component: ContraVpnComponent;
  let fixture: ComponentFixture<ContraVpnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContraVpnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContraVpnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
