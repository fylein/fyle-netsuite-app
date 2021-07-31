import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupMappingErrorComponent } from './group-mapping-error.component';

describe('GroupMappingErrorComponent', () => {
  let component: GroupMappingErrorComponent;
  let fixture: ComponentFixture<GroupMappingErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMappingErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMappingErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
