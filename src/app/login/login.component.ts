import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth.service'; // Adjust the path if necessary
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Ensure this import for compatibility

@Component({
  selector: 'app-signin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user$!: Observable<firebase.User | null>; // Use firebase.User for correct typing

  constructor(
    public angularFireAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.getUserInfo();
  }

  logOut() {
    this.angularFireAuth.signOut();
  }
}
