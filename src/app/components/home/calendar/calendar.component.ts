import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/compat/app';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskRefreshService } from '../../../services/task-refresh.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: false }) calendarComponent!: ElementRef;
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
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventDragStop: this.handleEventDragStop.bind(this),
  };
  user: firebase.User | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private taskRefreshService: TaskRefreshService // Inject TaskListComponent
  ) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.loadCalendarEvents();
      }
    });
  }

  ngAfterViewInit(): void {
    const calendarEl = this.calendarComponent.nativeElement;
    // calendarEl.addEventListener('dragleave', this.handleDragLeave.bind(this));
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
    const date = new Date(info.dateStr);
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

    const updatedTask: Task = {
      _id: taskId,
      userID: this.user!.uid,
      taskName: taskName,
      description: '',
      category: '',
      date: today.toISOString().split('T')[0], // Extract the date part
      startTime: today.toTimeString().split(' ')[0], // Extract the time part
      endTime: new Date(today.getTime() + durationMinutes * 60000)
        .toTimeString()
        .split(' ')[0], // Extract the time part
      duration: durationMinutes,
      completionStatus: false,
      label: '',
      priority: '',
    };

    // Update the server
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents(); // Reload events to ensure updated events are correctly displayed
        this.taskRefreshService.triggerReloadTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );

    console.log('Dropped event:', info);
  }

  handleEventDragStop(info: { event: any; jsEvent: MouseEvent }): void {
    const calendarEl = this.calendarComponent.nativeElement;
    const { left, top, width, height } = calendarEl.getBoundingClientRect();

    if (
      info.jsEvent.clientX < left ||
      info.jsEvent.clientX > left + width ||
      info.jsEvent.clientY < top ||
      info.jsEvent.clientY > top + height
    ) {
      const taskId = info.event.id;

      if (!taskId) {
        console.error('Event drag stop missing task ID.');
        return;
      }

      const updatedTask: Task = {
        _id: taskId,
        userID: this.user!.uid,
        taskName: info.event.title,
        description: '',
        category: '',
        date: info.event.date,
        startTime: '',
        endTime: '',
        duration: 0,
        completionStatus: false,
        label: '',
        priority: '',
      };

      // Update the server
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          console.log('Task updated successfully:', response);
          this.loadCalendarEvents(); // Reload events to ensure updated events are correctly displayed
          this.taskRefreshService.triggerReloadTasks();
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );

      info.event.remove(); // Remove the event from the calendar
      console.log('Event dragged out:', info);
    }
  }

  handleEventDrop(info: { event: any }): void {
    const taskId = info.event.id;
    const start = info.event.start;
    const end = info.event.end;

    console.log('Event drop info:', { taskId, start, end });

    if (!taskId || !start || !end) {
      console.error('Event drop missing information.');
      return;
    }

    const updatedTask: Task = {
      _id: taskId,
      userID: this.user!.uid,
      taskName: info.event.title,
      description: '',
      category: '',
      date: start.toISOString().split('T')[0], // Extract the date part
      startTime: start.toTimeString().split(' ')[0], // Extract the time part
      endTime: end.toTimeString().split(' ')[0], // Extract the time part
      duration: (end.getTime() - start.getTime()) / 60000, // Calculate duration in minutes
      completionStatus: false,
      label: '',
      priority: '',
    };

    // Update the server
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents(); // Reload events to ensure updated events are correctly displayed
        this.taskRefreshService.triggerReloadTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );

    console.log('Event dropped:', info);
  }

  handleEventResize(info: { event: any }): void {
    const taskId = info.event.id;
    const start = info.event.start;
    const end = info.event.end;

    console.log('Event resize info:', { taskId, start, end });

    if (!taskId || !start || !end) {
      console.error('Event resize missing information.');
      return;
    }

    const updatedTask: Task = {
      _id: taskId,
      userID: this.user!.uid,
      taskName: info.event.title,
      description: '',
      category: '',
      date: start.toISOString().split('T')[0], // Extract the date part
      startTime: start.toTimeString().split(' ')[0], // Extract the time part
      endTime: end.toTimeString().split(' ')[0], // Extract the time part
      duration: (end.getTime() - start.getTime()) / 60000, // Calculate duration in minutes
      completionStatus: false,
      label: '',
      priority: '',
    };

    // Update the server
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents(); // Reload events to ensure updated events are correctly displayed
        this.taskRefreshService.triggerReloadTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );

    console.log('Event resized:', info);
  }

  isDescendant(child: HTMLElement, parent: HTMLElement): boolean {
    let node: HTMLElement | null = child;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  }
}
