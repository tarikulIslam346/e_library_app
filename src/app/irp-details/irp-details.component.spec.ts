import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrpDetailsComponent } from './irp-details.component';

describe('IrpDetailsComponent', () => {
  let component: IrpDetailsComponent;
  let fixture: ComponentFixture<IrpDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrpDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
