import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SawaggerComponent } from './sawagger.component';

describe('SawaggerComponent', () => {
  let component: SawaggerComponent;
  let fixture: ComponentFixture<SawaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SawaggerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SawaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
