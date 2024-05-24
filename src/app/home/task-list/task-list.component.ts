import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../task.service';
import { AuthService } from '../../auth.service';
import firebase from 'firebase/compat/app';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../task-details-popup/task-details-popup.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  user: firebase.User | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.getTasks();
      }
    });
  }

  openTaskDetailsDialog(task: Task): void {
    this.dialog.open(TaskDetailsPopupComponent, {
      width: '600px',
      data: task
    });
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
        console.log('Tasks:', this.tasks);
      },
      (error) => {
        console.error('There was an error fetching the tasks!', error);
      }
    );
  }
}
