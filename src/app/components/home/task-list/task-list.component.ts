import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { TaskRefreshService } from '../../../services/task-refresh.service';
import firebase from 'firebase/compat/app';
import { Draggable } from '@fullcalendar/interaction';

import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../task-details-popup/task-details-popup.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  user: firebase.User | null = null;
  isLoading = true;
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private taskRefreshService: TaskRefreshService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.isLoading = true;
        this.loadListTasks(this.user.uid);
      }
    });

    this.taskRefreshService.reloadTasks$.subscribe(() => {
      this.isLoading = true;
      if (this.user) {
        this.loadListTasks(this.user.uid);
      }
    });
  }

  openTaskDetailsDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailsPopupComponent, {
      width: '600px',
      data: task,
    });

    // Subscribe to the taskUpdated event emitted by the TaskDetailsPopupComponent
    dialogRef.componentInstance.taskUpdated.subscribe((updatedTask: Task) => {
      // Find the index of the updated task in the tasks array
      const index = this.tasks.findIndex(t => t._id === updatedTask._id);
      if (index !== -1) {
        // Update the task in the tasks array
        this.tasks[index] = updatedTask;
        // Optionally, filter the tasks again
        this.filterTasks();
      }
    });
  }

  ngAfterViewInit(): void {
    let draggableEl = document.getElementById('task-list');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
          let title = eventEl.getAttribute('data-taskName');
          let date = eventEl.getAttribute('data-date');
          return {
            title: title,
            start: date,
          };
        },
      });
    }
  }

  loadListTasks(uid: string): void {
    this.isLoading = true;
    this.taskService.getTasks(uid).subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.filterTasks();
        console.log('Tasks:', this.filteredTasks);
        this.isLoading = false;
      },
      (error) => {
        console.error('There was an error fetching the tasks!', error);
        this.isLoading = false;
      }
    );
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(
      (task) => !task.startTime || !task.endTime
    );
  }
}
