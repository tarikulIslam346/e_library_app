import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PptShowComponent } from './ppt-show.component';

describe('PptShowComponent', () => {
  let component: PptShowComponent;
  let fixture: ComponentFixture<PptShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PptShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PptShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
