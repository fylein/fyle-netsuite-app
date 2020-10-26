import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRecordsDialogComponent } from './custom-records-dialog.component';

describe('CustomRecordsDialogComponent', () => {
  let component: CustomRecordsDialogComponent;
  let fixture: ComponentFixture<CustomRecordsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRecordsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRecordsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
