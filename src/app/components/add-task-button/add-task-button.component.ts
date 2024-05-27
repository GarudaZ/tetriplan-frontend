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
  date: Date = new Date(); 
  startTime: Date = new Date(); 
  endTime: Date = new Date(); 

  @Output() addTaskClicked = new EventEmitter<{ taskName: string, category: string, date: Date, startTime: Date, endTime: Date }>(); 

  openTaskPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.resetForm();
  }

  submitTask() {
    if (this.taskName && this.category) {
      // Emit an event with task details
      this.addTaskClicked.emit({ taskName: this.taskName, category: this.category, date: this.date, startTime: this.startTime, endTime: this.endTime });
      this.closePopup();
    }
  }

  resetForm() {
    this.taskName = '';
    this.category = ''; 
    this.date = new Date(); 
    this.startTime = new Date(); 
    this.endTime = new Date(); 
  }
}





