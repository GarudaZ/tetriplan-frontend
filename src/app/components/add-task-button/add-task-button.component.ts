import { Component, Output, EventEmitter } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-add-task-button',
  templateUrl: './add-task-button.component.html',
  styleUrls: ['./add-task-button.component.css'],
})
export class AddTaskButtonComponent {
  user: firebase.User | null = null;
  constructor(private authService: AuthService) {}

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

  // not sure this is needed
  @Output() addTaskClicked = new EventEmitter<{
    taskName: string;
    category: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
  }>();

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
          .get(`/api/users/${uid}`)
          .then((response) => {
            newTask.userID = response.data.user._id;
            console.log(newTask);

            return axios.post(`/api/users/${uid}/tasks`, newTask);
          })
          .then((response) => {
            console.log('Task added successfully:', response.data);
            // this.addTaskClicked.emit(newTask); // Optionally emit the event if needed
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
