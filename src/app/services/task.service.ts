import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import axios from 'axios';

export interface Task {
  _id: string;
  userID: string;
  taskName: string;
  description: string;
  category: string;
  calendar?: string;
  date?: string;
  startTime: string;
  endTime: string;
  duration: number;
  completionStatus: boolean;
  // tags: string[]; // Thi line Ladan added
  label: string;
  priority: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  // fetch tasks from the server using axios
  getTasks(uid: string): Observable<Task[]> {
    console.log('loading tasks');

    return new Observable((observer) => {
      axios
        .get(`https://tetriplan.onrender.com/api/users/${uid}/tasks`)
        // .get(`https://tetriplan.onrender.com/api/users/${uid}/tasks`)
        .then((response) => {
          console.log(response.data.tasks);
          // converts calendar key to date
          const tasks = response.data.tasks.map((task: any) => ({
            ...task,
            date: task.calendar,
          }));

          observer.next(response.data.tasks);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // convert tasks to FullCalendar events
  getCalendarEvents(uid: string): Observable<any[]> {
    return this.getTasks(uid).pipe(
      map((tasks) => {
        const events = tasks.map((task) => ({
          id: task._id,
          title: task.taskName,
          date: task.calendar,
          start: `${task.calendar}T${task.startTime}`,
          end: `${task.calendar}T${task.endTime}`,
          description: task.description,
          category: task.category,
          duration: task.duration,
          completionStatus: task.completionStatus,
          label: task.label,
          priority: task.priority,
        }));
        console.log('FullCalendar events:', events);
        return events;
      })
    );
  }

  // update task on the server
  updateTask(task: Task): Observable<any> {
    const { _id, userID, date, ...rest } = task;
    const taskUpdateData = {
      ...rest,
      calendar: date,
    };

    console.log('Updating task:', taskUpdateData);

    return new Observable((observer) => {
      axios
        .patch(
          `https://tetriplan.onrender.com/api/tasks/${task._id}`,
          taskUpdateData
        )
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  deleteTask(taskID: string): Observable<any> {
    console.log('Deleting task:', taskID);

    return new Observable((observer) => {
      axios
        .delete(`https://tetriplan.onrender.com/api/tasks/${taskID}`)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
