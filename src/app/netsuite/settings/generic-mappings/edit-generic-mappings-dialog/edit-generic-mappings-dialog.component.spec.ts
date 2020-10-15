import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGenericMappingsDialogComponent } from './edit-generic-mappings-dialog.component';

describe('EditGenericMappingsDialogComponent', () => {
  let component: EditGenericMappingsDialogComponent;
  let fixture: ComponentFixture<EditGenericMappingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGenericMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGenericMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
