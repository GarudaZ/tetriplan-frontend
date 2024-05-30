import { Component } from '@angular/core';
import { DateService } from '../../../services/date.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mini-calendar',
  templateUrl: './mini-calendar.component.html',
  styleUrls: ['./mini-calendar.component.css'],
})
export class MiniCalendarComponent {
  selectedDate: NgbDateStruct | null = null;

  constructor(private dateService: DateService) {}

  onDateSelect(date: NgbDateStruct): void {
    this.selectedDate = date;
    this.dateService.setSelectedDate(this.selectedDate);
  }

  resetDateFilter(): void {
    this.selectedDate = { year: 1970, month: 1, day: 1 };
    this.dateService.setSelectedDate(null);
  }
}
