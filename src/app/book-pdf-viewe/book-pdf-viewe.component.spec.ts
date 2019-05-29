import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPdfVieweComponent } from './book-pdf-viewe.component';

describe('BookPdfVieweComponent', () => {
  let component: BookPdfVieweComponent;
  let fixture: ComponentFixture<BookPdfVieweComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookPdfVieweComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPdfVieweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
