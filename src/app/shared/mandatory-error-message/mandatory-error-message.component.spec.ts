import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MandatoryErrorMessageComponent } from './mandatory-error-message.component';

describe('MandatoryErrorMessageComponent', () => {
  let component: MandatoryErrorMessageComponent;
  let fixture: ComponentFixture<MandatoryErrorMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatoryErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
