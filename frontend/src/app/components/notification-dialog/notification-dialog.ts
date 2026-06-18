import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './notification-dialog.html',
  styleUrls: ['./notification-dialog.css'],
})
export class NotificationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string[]) {}
}
