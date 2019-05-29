import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FineShowComponent } from './fine-show.component';

describe('FineShowComponent', () => {
  let component: FineShowComponent;
  let fixture: ComponentFixture<FineShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FineShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FineShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
