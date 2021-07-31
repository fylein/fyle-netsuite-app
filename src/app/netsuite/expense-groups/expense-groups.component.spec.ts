import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpenseGroupsComponent } from './expense-groups.component';

describe('ExpenseGroupsComponent', () => {
  let component: ExpenseGroupsComponent;
  let fixture: ComponentFixture<ExpenseGroupsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
