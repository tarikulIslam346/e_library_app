import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMemberRequestComponent } from './view-member-request.component';

describe('ViewMemberRequestComponent', () => {
  let component: ViewMemberRequestComponent;
  let fixture: ComponentFixture<ViewMemberRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMemberRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMemberRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
