import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service'; 
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; 

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

  login() {
    if (this.email === '') {
      alert('Please enter email');
      return;
    }

    if (this.password === '') {
      alert('Please enter password');
      return;
    }

    this.authService.login(this.email, this.password);
    this.email = '';
    this.password = '';
  }

  logOut() {
    this.angularFireAuth.signOut();
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}