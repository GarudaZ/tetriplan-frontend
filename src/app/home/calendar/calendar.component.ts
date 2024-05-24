import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../task.service';
import { AuthService } from '../../auth.service';
import firebase from 'firebase/compat/app';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: 'timeGridDay',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek',
    },
    events: [],
    allDaySlot: false,
    height: 'auto',
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    nowIndicator: true,
  };
  user: firebase.User | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.taskService
          .getCalendarEvents(this.user.uid)
          .subscribe((events) => {
            this.calendarOptions.events = events;
          });
      }
    });
  }
}
