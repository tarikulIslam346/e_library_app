import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPublisherComponent } from './view-publisher.component';

describe('ViewPublisherComponent', () => {
  let component: ViewPublisherComponent;
  let fixture: ComponentFixture<ViewPublisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPublisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
