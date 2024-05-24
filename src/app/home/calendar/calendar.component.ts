import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../task.service';
import { AuthService } from '../../auth.service';
import firebase from 'firebase/compat/app';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
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
    editable: true,
    droppable: true,
    drop: this.handleDrop.bind(this),
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
        this.loadCalendarEvents();
      }
    });
  }

  loadCalendarEvents(): void {
    this.taskService.getCalendarEvents(this.user!.uid).subscribe((events) => {
      this.calendarOptions.events = events;
    });
  }

  handleDrop(info: {
    date: Date;
    dateStr: string;
    draggedEl: HTMLElement;
    jsEvent: MouseEvent;
    view: { calendar: any };
  }): void {
    const calendarApi = info.view.calendar;
    const dateStr = info.dateStr;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(date.getHours(), date.getMinutes(), 0, 0);

    const taskName = info.draggedEl.getAttribute('data-taskName');
    const taskId = info.draggedEl.getAttribute('data-id');
    const taskDuration = info.draggedEl.getAttribute('data-duration');

    if (!taskName || !taskId) {
      console.error('Task name or task ID is missing.');
      return;
    }

    const durationMinutes = taskDuration ? parseInt(taskDuration, 10) : 60; // Default to 60 minutes if taskDuration is invalid or missing

    const startTime = today.toISOString();
    const endTime = new Date(
      today.getTime() + durationMinutes * 60000
    ).toISOString();

    const existingEvent = calendarApi.getEventById(taskId);
    if (existingEvent) {
      existingEvent.remove(); // Remove the existing event before adding the updated one
    }

    const newEvent = {
      id: taskId,
      title: taskName,
      start: startTime,
      end: endTime,
    };

    calendarApi.addEvent(newEvent); // Add event to the calendar

    // Create the updated task object
    const updatedTask: Task = {
      _id: taskId,
      userID: this.user!.uid,
      taskName: taskName,
      description: '', // Add description if needed
      category: '', // Add category if needed
      date: today.toISOString().split('T')[0], // Extract the date part
      startTime: today.toTimeString().split(' ')[0], // Extract the time part
      endTime: new Date(today.getTime() + durationMinutes * 60000)
        .toTimeString()
        .split(' ')[0], // Extract the time part
      duration: durationMinutes,
      completionStatus: false,
      label: '', // Add label if needed
      priority: '', // Add priority if needed
    };

    // Update the task on the server
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents(); // Reload events to ensure updated events are correctly displayed
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );

    console.log('Dropped event:', info);
  }
}
