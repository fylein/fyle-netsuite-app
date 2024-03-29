import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationDialogComponent } from './configuration-dialog.component';

describe('GenericMappingsDialogComponent', () => {
  let component: ConfigurationDialogComponent;
  let fixture: ComponentFixture<ConfigurationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
