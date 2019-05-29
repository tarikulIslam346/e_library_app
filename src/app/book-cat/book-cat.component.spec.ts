import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCatComponent } from './book-cat.component';

describe('BookCatComponent', () => {
  let component: BookCatComponent;
  let fixture: ComponentFixture<BookCatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookCatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
