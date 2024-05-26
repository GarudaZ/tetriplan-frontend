import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';

'../../auth.service'
import firebase from 'firebase/compat/app';
import { Draggable } from '@fullcalendar/interaction';

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
        this.getTasks(this.user.uid);
      }
    });
  }

  openTaskDetailsDialog(task: Task): void {
    this.dialog.open(TaskDetailsPopupComponent, {
      width: '600px',
      data: task
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

  getTasks(uid: string): void {
    this.taskService.getTasks(uid).subscribe(
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
