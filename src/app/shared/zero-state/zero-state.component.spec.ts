import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZeroStateComponent } from './zero-state.component';

describe('ZeroStateComponent', () => {
  let component: ZeroStateComponent;
  let fixture: ComponentFixture<ZeroStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZeroStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
