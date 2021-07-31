import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeneralMappingsComponent } from './general-mappings.component';

describe('GeneralMappingsComponent', () => {
  let component: GeneralMappingsComponent;
  let fixture: ComponentFixture<GeneralMappingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
