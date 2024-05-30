import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';
import { TaskRefreshService } from '../../services/task-refresh.service';


@Component({
  selector: 'app-ai-favourite-tasks',
  templateUrl: './ai-favourite-tasks.component.html',
  styleUrl: './ai-favourite-tasks.component.css',
})
export class AIFavouriteTasksComponent {
  showPopup: boolean = false;
  showBigPopup: boolean = false;
  aiTasks: {
    taskName: string;
    category: string;
    taskDescription: string;
    date: string;
    startTime: string;
    endTime: string;
    estimate: number;
    label: string;
    priority: string;
    completionStatus: boolean;
  }[] = [];
  user: firebase.User | null = null;
  isLoading: boolean = false;
  isProcessingTask: boolean = false;

  constructor(
    private authService: AuthService,
    private taskRefreshService: TaskRefreshService
  ) {}

  ngOnInit(): void {
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 2 * 60 * 1000);
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup(event: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showPopup = false
  }

  openBigPopup() {
    this.showBigPopup = true;
    this.showPopup = false;
    this.fetchApiEndpoint();
  }

  closeBigPopup() {
    this.showBigPopup = false;
  }

  // taskName: string = '';
  // category: string = 'none';
  // taskDescription: string = '';
  // date: string = '';
  // startTime: string = '';
  // endTime: string = '';
  // estimate: number = 30;
  // label: string = 'none';
  // priority: string = 'none';
  // completionStatus: boolean = false;

  submitAiTask(task: any) {
    if (this.isProcessingTask) return; 
    this.isProcessingTask = true;
    this.isLoading = true;

    this.authService.getUserInfo().subscribe((user) => {
      if (user) {
        const uid = user.uid;
        const newTask = {
          taskName: task.taskName,
          category: task.category || 'none',
          description: task.description || '',

          calendar: task.date || '',
          startTime: task.startTime || '',
          endTime: task.endTime || '',
          duration: task.estimate || 30,

          userID: '',
          label: task.label || 'none',
          priority: task.priority || 'none',
          completionStatus: task.completionStatus || false,
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
            this.closeBigPopup();
          })
          .catch((error) => {
            console.error('Error adding task:', error);
          })
          .finally(() => {
this.isProcessingTask = false;
this.isLoading = false;
          })
      }
    });
  }

  fetchApiEndpoint() {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {

        const uid = this.user.uid;

        axios
          .get(
            `https://tetriplan.onrender.com/api/users/${uid}/recommended-tasks`
          )
          .then((response) => {
            this.aiTasks = response.data.recommendedTasks;
          })
          .catch((error) => {
            console.error('Error fetching API endpoint:', error);
          });
      }
    });
  }
}
