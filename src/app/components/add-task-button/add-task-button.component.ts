import { Component, Output, EventEmitter } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';
import { TaskService } from '../../services/task.service';
import { TaskRefreshService } from '../../services/task-refresh.service';
@Component({
  selector: 'app-add-task-button',
  templateUrl: './add-task-button.component.html',
  styleUrls: ['./add-task-button.component.css'],
})
export class AddTaskButtonComponent {
  user: firebase.User | null = null;
  categories: string[] = [];
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private taskRefreshService: TaskRefreshService
  ) {}

  ngOnInit(): void {
    this.taskService.categories$.subscribe((categories) => {
      this.categories = categories;
      console.log('Task categories:', this.categories);
    });
  }

  showPopup: boolean = false;

  taskName: string = '';
  category: string = '';
  taskDescription: string = '';
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  estimate: number = 30;
  label: string = 'none';
  priority: string = 'none';
  completionStatus: boolean = false;

  openTaskPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.resetForm();
  }

  submitTask() {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        const uid = this.user.uid;
        const newTask = {
          taskName: this.taskName,
          category: this.category,
          description: this.taskDescription,
          calendar: this.date,
          startTime: this.startTime,
          endTime: this.endTime,
          duration: this.estimate,
          userID: '',
          label: this.label,
          priority: this.priority,
          completionStatus: this.completionStatus,
        };

        axios
          .get(`https://tetriplan.onrender.com/api/users/${uid}`)
          .then((response) => {
            newTask.userID = response.data.user._id;

            return axios.post(
              `https://tetriplan.onrender.com/api/users/${uid}/tasks`,
              newTask
            );
          })
          .then((response) => {
            this.taskRefreshService.triggerReloadTasks();
            console.log('Task added successfully:', response.data);
            this.closePopup();
          })
          .catch((error) => {
            console.error('Error adding task:', error);
          });
      }
    });
  }

  resetForm() {
    this.taskName = '';
    this.category = '';
    this.taskDescription = '';
    this.date = '';
    this.startTime = '';
    this.endTime = '';
  }

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}:00`;
  }
}
