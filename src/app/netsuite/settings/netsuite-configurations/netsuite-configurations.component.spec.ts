import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NetsuiteConfigurationsComponent } from './netsuite-configurations.component';

describe('NetsuiteConfigurationsComponent', () => {
  let component: NetsuiteConfigurationsComponent;
  let fixture: ComponentFixture<NetsuiteConfigurationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetsuiteConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetsuiteConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
