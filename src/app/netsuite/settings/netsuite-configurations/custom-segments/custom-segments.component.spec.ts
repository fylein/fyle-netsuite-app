import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSegmentsComponent } from './custom-segments.component';

describe('CustomSegmentsComponent', () => {
  let component: CustomSegmentsComponent;
  let fixture: ComponentFixture<CustomSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
