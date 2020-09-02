import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteCallbackComponent } from './netsuite-callback.component';

describe('NetsuiteCallbackComponent', () => {
  let component: NetsuiteCallbackComponent;
  let fixture: ComponentFixture<NetsuiteCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetsuiteCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetsuiteCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
