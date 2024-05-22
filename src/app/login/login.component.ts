import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth.service'; // Adjust the path if necessary
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Ensure this import for compatibility

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user$!: Observable<firebase.User | null>; // Use firebase.User for correct typing
  email: string = '';
  password: string = '';

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
  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  async loginWithEmailPassword() {
    try {
      await this.angularFireAuth.signInWithEmailAndPassword(this.email, this.password);
    } catch (error) {
      console.error('Error during login with email and password', error);
    }
  }
}
