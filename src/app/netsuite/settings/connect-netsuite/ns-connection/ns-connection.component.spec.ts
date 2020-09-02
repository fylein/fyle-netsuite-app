import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsConnectionComponent } from './ns-connection.component';

describe('NsConnectionComponent', () => {
  let component: NsConnectionComponent;
  let fixture: ComponentFixture<NsConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
