import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeMappingsDialogComponent } from './edit-employee-mappings-dialog.component';

describe('EditEmployeeMappingsDialogComponent', () => {
  let component: EditEmployeeMappingsDialogComponent;
  let fixture: ComponentFixture<EditEmployeeMappingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
