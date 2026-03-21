import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-requirement-result-dialog-component',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './requirement-result-dialog-component.component.html',
  styleUrl: './requirement-result-dialog-component.component.scss',
})
export class RequirementResultDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<RequirementResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { success: boolean; message: string },
  ) {}

  close() {
    this.dialogRef.close(this.data.success);
  }
}
