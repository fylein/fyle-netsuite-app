import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingErrorsComponent } from './mapping-errors.component';

describe('MappingErrorsComponent', () => {
  let component: MappingErrorsComponent;
  let fixture: ComponentFixture<MappingErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
