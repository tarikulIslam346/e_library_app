import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBookIssueListComponent } from './show-book-issue-list.component';

describe('ShowBookIssueListComponent', () => {
  let component: ShowBookIssueListComponent;
  let fixture: ComponentFixture<ShowBookIssueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBookIssueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBookIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
