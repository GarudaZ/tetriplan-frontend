import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { TaskRefreshService } from '../../../services/task-refresh.service';
import { DateService } from '../../../services/date.service';
import firebase from 'firebase/compat/app';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../task-details-popup/task-details-popup.component';
import { Draggable } from '@fullcalendar/interaction';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  selectedDate: NgbDateStruct | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private taskRefreshService: TaskRefreshService,
    private dateService: DateService,
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

    this.dateService.selectedDate$.subscribe((date) => {
      this.selectedDate = date;
      this.filterTasks();
    });
  }

  openTaskDetailsDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailsPopupComponent, {
      width: '600px',
      data: task,
    });

    dialogRef.componentInstance.taskUpdated.subscribe((updatedTask: Task) => {
      const index = this.tasks.findIndex((t) => t._id === updatedTask._id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
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
        console.log('Filtered Tasks:', this.filteredTasks);
        this.isLoading = false;
      },
      (error) => {
        console.error('There was an error fetching the tasks!', error);
        this.isLoading = false;
      }
    );
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      //date picker filtering
      if (this.selectedDate) {
        console.log(this.selectedDate);

        const taskDate = task.calendar;
        const selectedDate = `${this.selectedDate.year}-${String(
          this.selectedDate.month
        ).padStart(2, '0')}-${String(this.selectedDate.day).padStart(2, '0')}`;

        if (taskDate !== selectedDate) return false;
      }
      // shows only tasks not in main cal
      return !task.startTime || !task.endTime || !task.calendar;
    });
  }

  hideCompletedTasks: boolean = false;

  toggleHideCompletedTasks() {
    this.hideCompletedTasks = !this.hideCompletedTasks;
  }
}
