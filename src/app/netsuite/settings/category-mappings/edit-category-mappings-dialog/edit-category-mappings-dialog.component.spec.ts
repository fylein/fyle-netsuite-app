import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryMappingsDialogComponent } from './edit-category-mappings-dialog.component';

describe('EditCategoryMappingsDialogComponent', () => {
  let component: EditCategoryMappingsDialogComponent;
  let fixture: ComponentFixture<EditCategoryMappingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoryMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
