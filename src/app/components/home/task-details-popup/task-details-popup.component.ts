
import { Component, EventEmitter, Inject, Output  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../../services/task.service';

@Component({
  selector: 'app-task-details-popup',
  templateUrl: './task-details-popup.component.html',
  styleUrls: ['./task-details-popup.component.css'] 
})
export class TaskDetailsPopupComponent {
    
  isEditing = false;
  editableTask: Task;

  @Output() taskUpdated = new EventEmitter<Task>();

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {

    this.editableTask = { ...data }; // Make a copy of the task data
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveTask(): void {
    // Emit the updated task data
    this.taskUpdated.emit(this.editableTask);
    console.log('Task saved', this.editableTask);
    this.isEditing = false;
    this.closeDialog(); 
  }
}

