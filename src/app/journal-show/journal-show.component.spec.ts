import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalShowComponent } from './journal-show.component';

describe('JournalShowComponent', () => {
  let component: JournalShowComponent;
  let fixture: ComponentFixture<JournalShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
