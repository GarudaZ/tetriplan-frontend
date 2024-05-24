import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../task.service';

@Component({
  selector: 'app-task-details-popup',
  templateUrl: './task-details-popup.component.html',
  styleUrl: './task-details-popup.component.css'
})
export class TaskDetailsPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}

