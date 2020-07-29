import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseReportsComponent } from './expense-reports.component';

describe('ExpenseReportsComponent', () => {
  let component: ExpenseReportsComponent;
  let fixture: ComponentFixture<ExpenseReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
