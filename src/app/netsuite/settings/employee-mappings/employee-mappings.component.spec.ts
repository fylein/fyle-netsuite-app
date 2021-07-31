import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeMappingsComponent } from './employee-mappings.component';

describe('EmployeeMappingsComponent', () => {
  let component: EmployeeMappingsComponent;
  let fixture: ComponentFixture<EmployeeMappingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
