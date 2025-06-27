import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsiconverterComponent } from './dsiconverter.component';

describe('DsiconverterComponent', () => {
  let component: DsiconverterComponent;
  let fixture: ComponentFixture<DsiconverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsiconverterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsiconverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
