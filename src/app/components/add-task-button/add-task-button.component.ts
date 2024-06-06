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
  labels: string[] = [];
  isLoadingLabel: boolean = false;
  isLoadingCategory: boolean = false;
  showPopup: boolean = false;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private taskRefreshService: TaskRefreshService
  ) {}

  ngOnInit(): void {
    this.taskService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
    this.taskService.labels$.subscribe((labels) => {
      this.labels = labels;
    });
  }

  taskName: string = '';
  category: string = '';
  taskDescription: string = '';
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  estimate: number = 30;
  label: string = '';
  priority: string = 'none';
  completionStatus: boolean = false;

  async suggestLabel(): Promise<void> {
    if (!this.taskName.trim()) {
      return;
    }
    this.isLoadingLabel = true;
    const data = {
      inputs: this.taskName,
      parameters: {
        candidate_labels: this.labels,
      },
    };

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
          headers: {
            Authorization: `Bearer ${this.authService.getHuggingFaceToken()}`,
          },
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      if (result && result.labels && result.labels.length > 0) {
        this.label = result.labels[0];
      }
    } catch (error) {
      console.error('Error suggesting label:', error);
    }
    this.isLoadingLabel = false;
  }

  async suggestCategory(): Promise<void> {
    if (!this.taskName.trim()) {
      return;
    }
    this.isLoadingCategory = true;
    const data = {
      inputs: this.taskName,
      parameters: {
        candidate_labels: this.categories,
      },
    };

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
          headers: {
            Authorization: `Bearer ${this.authService.getHuggingFaceToken()}`,
          },
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      if (result && result.labels && result.labels.length > 0) {
        this.category = result.labels[0];
      }
    } catch (error) {
      console.error('Error suggesting category:', error);
    }
    this.isLoadingCategory = false;
  }

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
