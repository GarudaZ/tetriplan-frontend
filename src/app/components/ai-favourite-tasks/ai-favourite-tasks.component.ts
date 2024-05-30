import { Component } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../../services/auth.service'
import firebase from 'firebase/compat/app';
import { TaskRefreshService } from '../../services/task-refresh.service';

@Component({
  selector: 'app-ai-favourite-tasks',
  templateUrl: './ai-favourite-tasks.component.html',
  styleUrl: './ai-favourite-tasks.component.css'
})
export class AIFavouriteTasksComponent {
  showPopup: boolean = false;
  showBigPopup: boolean = false;
  aiTasks: {taskName: string ;
  category: string ;
  taskDescription: string ;
  date: string ;
  startTime: string ;
  endTime: string ;
  estimate: number ;
  label: string ;
  priority: string ;
  completionStatus: boolean ;
  }[] = [];
  user: firebase.User | null = null;

  constructor(private authService: AuthService, 
    private taskRefreshService: TaskRefreshService
  ) {}

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.showBigPopup = true;
    this.fetchApiEndpoint();  // Open the big popup when small popup is closed
  }

  closeBigPopup() {
    this.showBigPopup = false;
  }

  taskName: string = '';
  category: string = 'none';
  taskDescription: string = '';
  date: string = '';
  startTime: string = '';
  endTime: string = '';
  estimate: number = 30;
  label: string = 'none';
  priority: string = 'none';
  completionStatus: boolean = false;

  
  submitAiTask(task: any) {
    this.authService.getUserInfo().subscribe((user) => {
      if (user) {
        const uid = user.uid;
        const newTask = {
          taskName: task.taskName,
          category: task.category || 'none',
          description: task.description || '',
          calendar: task.date || '', // Set to appropriate default or fetched value
          startTime: task.startTime || '', // Set to appropriate default or fetched value
          endTime: task.endTime || '', // Set to appropriate default or fetched value
          duration: task.estimate || 30, // Set to appropriate default or fetched value
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
          });
      }
    });
  }

  fetchApiEndpoint() {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
      const uid = this.user.uid 
   console.log(uid)
      
      
    axios.get(`https://tetriplan.onrender.com/api/users/${uid}/recommended-tasks`)
      .then(response => {
        console.log(response)
        // this.apiEndpoint = response.data.user._id.recommended-tasks; 
        this.aiTasks = response.data.recommendedTasks
        console.log(this.aiTasks)
      })
      .catch(error => {
        console.error('Error fetching API endpoint:', error);
      });
    }
    });
  }
}

// .map((task: any)=> task.taskName);