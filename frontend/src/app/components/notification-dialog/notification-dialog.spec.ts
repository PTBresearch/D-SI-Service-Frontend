import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDialog } from './notification-dialog';

describe('NotificationDialog', () => {
  let component: NotificationDialog;
  let fixture: ComponentFixture<NotificationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
