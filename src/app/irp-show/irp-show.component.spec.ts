import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrpShowComponent } from './irp-show.component';

describe('IrpShowComponent', () => {
  let component: IrpShowComponent;
  let fixture: ComponentFixture<IrpShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrpShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrpShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
