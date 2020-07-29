import { TestBed } from '@angular/core/testing';

import { ExpenseReportsService } from './expense-reports.service';

describe('ExpenseReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpenseReportsService = TestBed.get(ExpenseReportsService);
    expect(service).toBeTruthy();
  });
});
