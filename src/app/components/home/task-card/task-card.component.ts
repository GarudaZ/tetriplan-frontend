import { Component, Input } from '@angular/core';
import { Task } from '../../../services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {

  @Input() task: Task | undefined;
  @Input() isTaskCompleted: boolean = false;
  @Input() hideCompletedTasks: boolean = false;

}
