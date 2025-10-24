import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from "../../model/User.model";

@Component({
  selector: 'app-user-add-dialog-component',
  templateUrl: './user-add-dialog-component.html',
  styleUrls: ['./user-add-dialog-component.css']
})
export class UserAddDialogComponent {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {}
  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.userForm = this.fb.group({
      userName: [this.data?.userName || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required]],
      role: [this.data?.role || '', Validators.required],
      active: [this.data?.active || false]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
