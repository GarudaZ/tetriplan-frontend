import { Component } from '@angular/core';

@Component({
  selector: 'app-mini-calendar',
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.css']
})
export class MiniCalendarComponent {
  isDisabled: boolean = true;
  selectedDate: any;

  constructor() { }

  onDateSelect(date: any): void {
    console.log("Hey You made it");
  }
}










