import { Component, OnInit } from '@angular/core';

// Mock setup
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { AuthService } from '../../auth.service';
import firebase from 'firebase/compat/app';

const mock = new MockAdapter(axios);

mock.onGet('/tasks/viU4gxMCWJXdvsEq3az5E7bi2N92').reply(200, {
  tasks: [
    {
      _id: '6649fcd20578065fb77505ee',
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N92',
      taskName: 'Example Task',
      description: 'This is an example task.',
      category: 'Work',
      date: '2024-05-19T00:00:00.000+00:00',
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
      completionStatus: false,
      tags: ['important', 'urgent'],
      label: 'Personal',
      priority: 'high',
    },
    {
      _id: '664b012b3c6ecd12544d1fbf',
      // "taskID": "232434",
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N92',
      taskName: 'Walk The Rat',
      description: 'I need to walk the rat after work',
      category: 'Pets',
      date: '2024-09-21',
      startTime: '19:00',
      endTime: '19:40',
      duration: '40',
      completionStatus: false,
      tags: ['important', 'urgent'],
      label: 'Personal',
      priority: 'low',
    },
    {
      _id: '664b15334e1f1eb9edc1baf5',
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N92',
      taskName: 'Feed The Rat',
      description: 'I need to feed the rat after work too',
      category: 'Pets',
      date: '2024-09-21',
      startTime: '19:30',
      endTime: '19:50',
      // request change to duration data to be just numbers
      duration: '10',
      completionStatus: false,
      label: 'Personal',
      priority: 'low',
    },
  ],
});

// Rest of component
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  user: firebase.User | null = null;

  // constructor() {}
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.getTasks(this.user.uid);
      }
    });
  }

  // see server getAllTasksById -- add Id here from Auth
  getTasks(uid: string): void {
    axios
      .get(`/tasks/${uid}`)
      .then((response) => {
        this.tasks = response.data.tasks;
        console.log(response.data.tasks);
      })
      .catch((error) => {
        console.error('There was an error fetching the users!', error);
      });
  }
}
