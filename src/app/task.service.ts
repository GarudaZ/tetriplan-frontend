import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Setup mock data
const mock = new MockAdapter(axios);

mock.onGet('/tasks/viU4gxMCWJXdvsEq3az5E7bi2N92').reply(200, {
  tasks: [
    {
      _id: '6649fcd20578065fb77505ee',
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N92',
      taskName: 'Example Task',
      description: 'This is an example task.',
      category: 'Work',
      date: '2024-05-23',
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
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N92',
      taskName: 'Walk The Rat',
      description: 'I need to walk the rat after work',
      category: 'Pets',
      date: '2024-05-23',
      startTime: '19:00',
      endTime: '19:40',
      duration: 40,
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
      date: '2024-05-24',
      startTime: '19:30',
      endTime: '19:50',
      duration: 10,
      completionStatus: false,
      label: 'Personal',
      priority: 'low',
    },
    {
      _id: '664b15334e1f1eb9edc1bag6',
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N92',
      taskName: 'Play with Rat',
      description: 'Hes been stuck inside all day',
      category: 'Pets',
      date: '2024-05-24',
      startTime: '19:50',
      endTime: '20:00',
      duration: 10,
      completionStatus: false,
      label: 'Personal',
      priority: 'low',
    },
    {
      _id: '664b15334e1f1eb9edc1bag6',
      userID: 'viU4gxMCWJXdvsEq3az5E7bi2N00',
      taskName: 'Watch TV',
      description: 'Ill be tired by now',
      category: 'Pets',
      date: '2024-05-24',
      startTime: '21:00',
      endTime: '21:30',
      duration: 30,
      completionStatus: false,
      label: 'Personal',
      priority: 'low',
    },
  ],
});

export interface Task {
  _id: string;
  userID: string;
  taskName: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  completionStatus: boolean;
  label: string;
  priority: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  // fetch tasks from the server using axios
  getTasks(): Observable<Task[]> {
    return new Observable((observer) => {
      axios
        .get('/tasks/viU4gxMCWJXdvsEq3az5E7bi2N92')
        .then((response) => {
          observer.next(response.data.tasks);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // convert tasks to FullCalendar events
  getCalendarEvents(): Observable<any[]> {
    return this.getTasks().pipe(
      map((tasks) =>
        tasks.map((task) => ({
          title: task.taskName,
          start: `${task.date}T${task.startTime}`,
          end: `${task.date}T${task.endTime}`,
          description: task.description,
          category: task.category,
          duration: task.duration,
          completionStatus: task.completionStatus,
          label: task.label,
          priority: task.priority,
        }))
      )
    );
  }
}
