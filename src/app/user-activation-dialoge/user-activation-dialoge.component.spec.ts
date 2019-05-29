import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivationDialogeComponent } from './user-activation-dialoge.component';

describe('UserActivationDialogeComponent', () => {
  let component: UserActivationDialogeComponent;
  let fixture: ComponentFixture<UserActivationDialogeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActivationDialogeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivationDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
