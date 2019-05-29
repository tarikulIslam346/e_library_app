import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCatViewComponent } from './book-cat-view.component';

describe('BookCatViewComponent', () => {
  let component: BookCatViewComponent;
  let fixture: ComponentFixture<BookCatViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookCatViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
