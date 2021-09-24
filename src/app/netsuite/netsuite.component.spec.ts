import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetSuiteComponent } from './netsuite.component';

describe('NetSuiteComponent', () => {
  let component: NetSuiteComponent;
  let fixture: ComponentFixture<NetSuiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetSuiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
