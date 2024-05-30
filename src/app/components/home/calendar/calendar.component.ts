import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TaskService, Task } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/compat/app';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskRefreshService } from '../../../services/task-refresh.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../task-details-popup/task-details-popup.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('calendar', { static: false }) calendarComponent!: ElementRef;
  @ViewChild(FullCalendarComponent) fullCalendar!: FullCalendarComponent;
  @Input() isExpanded: boolean = false;

  isLoading = true;
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
    eventColor: '#3ab399',
    drop: this.handleDrop.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventDragStop: this.handleEventDragStop.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };
  user: firebase.User | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private taskRefreshService: TaskRefreshService,
    private dialog: MatDialog
  ) {}

  handleEventClick(arg: any): void {
    const taskId = arg.event.id;
    const task = this.getTaskById(taskId);
    if (task) {
      const taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);

      const taskData: Task = {
        _id: task.id,
        userID: this.user!.uid,
        taskName: task.title,
        description: task.description,
        category: task.category,
        calendar: task.date,
        startTime: taskStart.toTimeString().split(' ')[0],
        endTime: taskEnd.toTimeString().split(' ')[0],
        duration: task.duration,
        completionStatus: task.completionStatus,
        label: task.label,
        priority: task.priority,
      };

      const dialogRef = this.dialog.open(TaskDetailsPopupComponent, {
        width: '600px',
        data: taskData,
      });

      const instance = dialogRef.componentInstance as TaskDetailsPopupComponent;
      instance.taskUpdated.subscribe((updatedTask: Task) => {
        this.taskService.updateTask(updatedTask).subscribe(
          (response) => {
            console.log('Task updated successfully:', response);
            this.loadCalendarEvents();
            this.taskRefreshService.triggerReloadTasks();
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
      });
    }
  }
  getTaskById(taskId: string): any {
    const events = this.calendarOptions.events as any[];

    return events.find((task) => task.id === taskId);
  }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
      if (this.user) {
        this.loadCalendarEvents();
      }
    });

    this.taskRefreshService.reloadTasks$.subscribe(() => {
      this.loadCalendarEvents();
    });
  }

  ngAfterViewInit(): void {
    const calendarEl = this.calendarComponent.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isExpanded']) {
      this.updateCalendarView();
    }
  }

  updateCalendarView(): void {
    if (this.fullCalendar && this.fullCalendar.getApi) {
      const calendarApi = this.fullCalendar.getApi();
      calendarApi.changeView(this.isExpanded ? 'timeGridWeek' : 'timeGridDay');
    }
  }

  loadCalendarEvents(): void {
    this.isLoading = true;
    this.taskService.getCalendarEvents(this.user!.uid).subscribe(
      (events) => {
        this.calendarOptions.events = events;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
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

    const taskId = info.draggedEl.getAttribute('data-id');
    const taskName = info.draggedEl.getAttribute('data-taskName');
    const taskDuration = info.draggedEl.getAttribute('data-duration');
    const taskDescription = info.draggedEl.getAttribute('data-description');
    const taskCategory = info.draggedEl.getAttribute('data-category');
    const taskLabel = info.draggedEl.getAttribute('data-label');
    const taskPriority = info.draggedEl.getAttribute('data-priority');
    const taskCompletionStatus =
      info.draggedEl.getAttribute('data-completionStatus') === 'true';

    if (!taskName || !taskId) {
      console.error('Task name or task ID is missing.');
      return;
    }
    this.isLoading = true;
    const durationMinutes = taskDuration ? parseInt(taskDuration, 10) : 60; // Default to 60 minutes

    const updatedTask: Task = {
      _id: taskId,
      userID: this.user!.uid,
      taskName: taskName,
      description: taskDescription || '',
      category: taskCategory || '',
      date: date.toISOString().split('T')[0],
      startTime: today.toTimeString().split(' ')[0],
      endTime: new Date(today.getTime() + durationMinutes * 60000)
        .toTimeString()
        .split(' ')[0],
      duration: durationMinutes,
      completionStatus: taskCompletionStatus,
      label: taskLabel || '',
      priority: taskPriority || '',
    };

    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents();
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

    this.isLoading = true;
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
        description: info.event.extendedProps.description,
        category: info.event.extendedProps.category,
        date: info.event.extendedProps.date,
        startTime: '',
        endTime: '',
        duration: info.event.extendedProps.duration,
        completionStatus: info.event.extendedProps.completionStatus,
        label: info.event.extendedProps.label,
        priority: info.event.extendedProps.priority,
      };

      // Update the server
      this.taskService.updateTask(updatedTask).subscribe(
        (response) => {
          console.log('Task updated successfully:', response);
          this.loadCalendarEvents();
          this.taskRefreshService.triggerReloadTasks();
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );

      info.event.remove();
      console.log('Event dragged out:', info);
    }
  }

  handleEventDrop(info: { event: any }): void {
    const taskId = info.event.id;
    const start = info.event.start;
    const end = info.event.end;

    this.isLoading = true;

    console.log('Event drop info:', { taskId, start, end });

    if (!taskId || !start || !end) {
      console.error('Event drop missing information.');
      return;
    }

    const updatedTask: Task = {
      _id: taskId,
      userID: this.user!.uid,
      taskName: info.event.title,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      date: start.toISOString().split('T')[0],
      startTime: start.toTimeString().split(' ')[0],
      endTime: end.toTimeString().split(' ')[0],
      duration: (end.getTime() - start.getTime()) / 60000,
      completionStatus: info.event.extendedProps.completionStatus,
      label: info.event.extendedProps.label,
      priority: info.event.extendedProps.priority,
    };

    // Update the server
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents();
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
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      date: start.toISOString().split('T')[0],
      startTime: start.toTimeString().split(' ')[0],
      endTime: end.toTimeString().split(' ')[0],
      duration: (end.getTime() - start.getTime()) / 60000,
      completionStatus: info.event.extendedProps.completionStatus,
      label: info.event.extendedProps.label,
      priority: info.event.extendedProps.priority,
    };

    // Update the server
    this.taskService.updateTask(updatedTask).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.loadCalendarEvents();
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
