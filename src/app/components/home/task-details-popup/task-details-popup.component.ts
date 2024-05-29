import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService, Task } from '../../../services/task.service';
import { TaskRefreshService } from '../../../services/task-refresh.service';

@Component({
  selector: 'app-task-details-popup',
  templateUrl: './task-details-popup.component.html',
  styleUrls: ['./task-details-popup.component.css'],
})
export class TaskDetailsPopupComponent {
  isEditing = false;
  editableTask: Task;

  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() completeTask: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private taskService: TaskService,
    private taskRefreshService: TaskRefreshService,
    public dialogRef: MatDialogRef<TaskDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.editableTask = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveTask(): void {
    this.taskService.updateTask(this.editableTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        // this.taskUpdated.emit(this.editableTask); // Emit the updated task
        this.taskRefreshService.triggerReloadTasks();
        this.isEditing = false;
        this.closeDialog();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  handleTaskCompleted(): void {
    // Toggle the task's completion status
    this.editableTask.completionStatus = !this.editableTask.completionStatus;

    this.taskService.updateTask(this.editableTask).subscribe(
      (response) => {
        console.log('Task completion status updated:', response);
        this.completeTask.emit(this.editableTask.completionStatus);
        this.taskUpdated.emit(this.editableTask);
        this.taskRefreshService.triggerReloadTasks();
        this.closeDialog();
      },
      (error) => {
        console.error('Error updating task completion status:', error);
      }
    );
  }
}
