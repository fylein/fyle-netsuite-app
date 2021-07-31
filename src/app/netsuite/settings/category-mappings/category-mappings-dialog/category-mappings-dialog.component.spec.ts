import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoryMappingsDialogComponent } from './category-mappings-dialog.component';

describe('CategoryMappingsDialogComponent', () => {
  let component: CategoryMappingsDialogComponent;
  let fixture: ComponentFixture<CategoryMappingsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryMappingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryMappingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
