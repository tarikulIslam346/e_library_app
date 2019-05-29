import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTypeMenuPermissionComponent } from './view-user-type-menu-permission.component';

describe('ViewUserTypeMenuPermissionComponent', () => {
  let component: ViewUserTypeMenuPermissionComponent;
  let fixture: ComponentFixture<ViewUserTypeMenuPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserTypeMenuPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserTypeMenuPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
