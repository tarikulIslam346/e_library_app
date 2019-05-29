import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PptDetailsComponent } from './ppt-details.component';

describe('PptDetailsComponent', () => {
  let component: PptDetailsComponent;
  let fixture: ComponentFixture<PptDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PptDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
