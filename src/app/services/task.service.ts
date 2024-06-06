import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  private labelsSubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categoriesSubject.asObservable();
  labels$ = this.labelsSubject.asObservable();

  constructor() {}

  getTasks(uid: string): Observable<Task[]> {
    console.log('loading tasks');

    return new Observable((observer) => {
      axios
        .get(`https://tetriplan.onrender.com/api/users/${uid}/tasks`)
        .then((response) => {
          // converts calendar key to date
          const tasks: Task[] = response.data.tasks.map((task: any) => ({
            ...task,
            date: task.calendar,
          }));

          const categories: string[] = [
            ...new Set(tasks.map((task: Task) => task.category)),
          ];
          this.categoriesSubject.next(categories);

          const labels: string[] = [
            ...new Set(tasks.map((task: Task) => task.label)),
          ];
          this.labelsSubject.next(labels);

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
        return events;
      })
    );
  }

  updateTask(task: Task): Observable<any> {
    const { _id, userID, date, ...rest } = task;
    const taskUpdateData = {
      ...rest,
      calendar: date,
    };

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
