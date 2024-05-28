import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: firebase.User | null = null;
  isExpanded: boolean = false;

  // onTaskAdded(event: { taskName: string, category: string }) {
  //   // Implement your logic to handle the task added event
  //   console.log('Task added:', event);
  // }

  toggleCalendar() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
    });
  }
}
