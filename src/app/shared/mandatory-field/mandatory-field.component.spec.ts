import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MandatoryFieldComponent } from './mandatory-field.component';

describe('MandatoryFieldComponent', () => {
  let component: MandatoryFieldComponent;
  let fixture: ComponentFixture<MandatoryFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
