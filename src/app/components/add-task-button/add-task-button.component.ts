import { Time } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-task-button',
  templateUrl: './add-task-button.component.html',
  styleUrls: ['./add-task-button.component.css']
})
export class AddTaskButtonComponent {
  showPopup: boolean = false;
  taskName: string = '';
  category: string = ''; 
  taskDescription: string = '';
  date:string = ''; 
  startTime: string = ''; 
  endTime: string = '';

  @Output() addTaskClicked = new EventEmitter<{ taskName: string, category: string,description: string, date: string, startTime: string, endTime: string, }>(); 

  openTaskPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.resetForm();
  }

  submitTask() {
    if (this.taskName && this.category && this.date && this.startTime && this.endTime && this.taskDescription) {
      // Emit an event with task details
      this.addTaskClicked.emit({ taskName: this.taskName, category: this.category,description: this.taskDescription, date: this.date, startTime: this.startTime, endTime: this.endTime });

      this.closePopup();
    }
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





