import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NsSubsidiaryComponent } from './ns-subsidiary.component';

describe('NsSubsidiaryComponent', () => {
  let component: NsSubsidiaryComponent;
  let fixture: ComponentFixture<NsSubsidiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NsSubsidiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NsSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
