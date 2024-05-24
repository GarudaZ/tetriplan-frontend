import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../task.service';
import { AuthService } from '../../auth.service';
import firebase from 'firebase/compat/app';
import { Draggable } from '@fullcalendar/interaction';

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
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.getTasks(this.user.uid);
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
