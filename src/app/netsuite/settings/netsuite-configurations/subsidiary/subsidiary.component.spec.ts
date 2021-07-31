import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubsidiaryComponent } from './subsidiary.component';

describe('SubsidiaryComponent', () => {
  let component: SubsidiaryComponent;
  let fixture: ComponentFixture<SubsidiaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
