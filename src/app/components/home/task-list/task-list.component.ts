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
        this.loadListTasks(this.user.uid);
      }
    });

    this.taskRefreshService.reloadTasks$.subscribe(() => {
      if (this.user) {
        this.loadListTasks(this.user.uid);
      }
    });
  }

  openTaskDetailsDialog(task: Task): void {
    this.dialog.open(TaskDetailsPopupComponent, {
      width: '600px',
      data: task,
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
    this.taskService.getTasks(uid).subscribe(
      (tasks) => {
        this.tasks = tasks;
        this.filterTasks();
        console.log('Tasks:', this.filteredTasks);
      },
      (error) => {
        console.error('There was an error fetching the tasks!', error);
      }
    );
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(
      (task) => !task.startTime || !task.endTime
    );
  }
}
