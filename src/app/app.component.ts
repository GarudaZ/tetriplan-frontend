import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import firebase from 'firebase/compat/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'tetraplan';
  user: firebase.User | null = null;

  constructor(private authService: AuthService, private location: Location) {}

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe((user) => {
      this.user = user;
    });
  }
  showHeader(): boolean {
    return !this.location.path().includes('/login' || '/register');
  }
}
