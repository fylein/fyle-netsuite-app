import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomSegmentsDialogComponent } from './custom-segments-dialog.component';

describe('CustomSegmentsDialogComponent', () => {
  let component: CustomSegmentsDialogComponent;
  let fixture: ComponentFixture<CustomSegmentsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSegmentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSegmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
