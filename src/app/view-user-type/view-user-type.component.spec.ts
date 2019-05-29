import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTypeComponent } from './view-user-type.component';

describe('ViewUserTypeComponent', () => {
  let component: ViewUserTypeComponent;
  let fixture: ComponentFixture<ViewUserTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
