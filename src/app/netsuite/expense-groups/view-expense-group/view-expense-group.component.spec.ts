import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewExpenseGroupComponent } from './view-expense-group.component';

describe('ViewExpenseGroupComponent', () => {
  let component: ViewExpenseGroupComponent;
  let fixture: ComponentFixture<ViewExpenseGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExpenseGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpenseGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
