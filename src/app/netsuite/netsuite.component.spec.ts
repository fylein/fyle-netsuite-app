import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteComponent } from './netsuite.component';

describe('NetsuiteComponent', () => {
  let component: NetsuiteComponent;
  let fixture: ComponentFixture<NetsuiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetsuiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetsuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
