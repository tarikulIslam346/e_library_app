import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuthorComponent } from './view-author.component';

describe('ViewAuthorComponent', () => {
  let component: ViewAuthorComponent;
  let fixture: ComponentFixture<ViewAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
