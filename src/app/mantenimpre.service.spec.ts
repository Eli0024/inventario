import { TestBed } from '@angular/core/testing';

import { MantenimpreService } from './services/mantenimpre.service';

describe('MantenimpreService', () => {
  let service: MantenimpreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantenimpreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
