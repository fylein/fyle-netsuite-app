import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SyncExportComponent } from './sync-export.component';

describe('SyncExportComponent', () => {
  let component: SyncExportComponent;
  let fixture: ComponentFixture<SyncExportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
