import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeMappingsDialogComponent } from './employee-mappings-dialog.component';

describe('EmployeeMappingsDialogComponent', () => {
  let component: EmployeeMappingsDialogComponent;
  let fixture: ComponentFixture<EmployeeMappingsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
