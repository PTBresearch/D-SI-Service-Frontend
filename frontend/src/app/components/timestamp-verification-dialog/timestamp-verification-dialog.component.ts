import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {TimestampVerificationResult} from "../../model/timestampVerificationResult.model";

@Component({
  selector: 'app-timestamp-verification-dialog',
  templateUrl: './timestamp-verification-dialog.component.html',
  styleUrls: ['./timestamp-verification-dialog.component.css']
})
export class TimestampVerificationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TimestampVerificationResult) {}
}
