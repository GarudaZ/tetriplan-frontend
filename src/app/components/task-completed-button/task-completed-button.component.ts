import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../home/task-details-popup/task-details-popup.component';
import { Task } from '../../services/task.service';

@Component({
  selector: 'app-task-completed-button',
  templateUrl: './task-completed-button.component.html',
  styleUrls: ['./task-completed-button.component.css'],
})
export class TaskCompletedButtonComponent {
  tasks: Task[] = [
    {
      _id: '1',
      userID: 'user1',
      taskName: 'Sample Task 1',
      description: 'This is a sample task',
      date: '2024-05-29',
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      completionStatus: false,
      category: 'Work',
      label: 'Urgent',
      priority: 'High',
    },
  ];

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  openTaskDetails(task: Task) {
    const dialogRef = this.dialog.open(TaskDetailsPopupComponent, {
      data: task,
    });

    dialogRef.componentInstance.completeTask.subscribe(
      (isCompleted: boolean) => {
        if (isCompleted) {
          task.completionStatus = true;
          this.cdr.detectChanges(); 
        }
      }
    );
  }
}
