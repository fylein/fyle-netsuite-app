import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericMappingsDialogComponent } from './generic-mappings-dialog.component';

describe('GenericMappingsDialogComponent', () => {
  let component: GenericMappingsDialogComponent;
  let fixture: ComponentFixture<GenericMappingsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
