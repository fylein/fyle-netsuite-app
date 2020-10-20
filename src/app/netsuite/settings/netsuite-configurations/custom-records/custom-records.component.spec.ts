import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRecordsComponent } from './custom-records.component';

describe('CustomRecordsComponent', () => {
  let component: CustomRecordsComponent;
  let fixture: ComponentFixture<CustomRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
