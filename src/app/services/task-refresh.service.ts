import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskRefreshService {
  private reloadTasksSubject = new Subject<void>();
  reloadTasks$ = this.reloadTasksSubject
    .asObservable()
    .pipe(concatMap(() => [null]));

  triggerReloadTasks() {
    // this.isLoading = true
    this.reloadTasksSubject.next();
  }
}
