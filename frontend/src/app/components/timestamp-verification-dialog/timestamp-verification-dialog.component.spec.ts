import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampVerificationDialogComponent } from './timestamp-verification-dialog.component';

describe('TimestampVerificationDialogComponent', () => {
  let component: TimestampVerificationDialogComponent;
  let fixture: ComponentFixture<TimestampVerificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimestampVerificationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimestampVerificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
