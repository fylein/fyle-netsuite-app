import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectNetsuiteComponent } from './connect-netsuite.component';

describe('ConnectNetsuiteComponent', () => {
  let component: ConnectNetsuiteComponent;
  let fixture: ComponentFixture<ConnectNetsuiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectNetsuiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectNetsuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
