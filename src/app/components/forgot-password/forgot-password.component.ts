import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent  implements OnInit {
  user$!: Observable<firebase.User | null>;
  email : string = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user$ = this.authService.getUserInfo();
  }

  forgotPassword() {
    if (!this.email) {
      alert('Please register');
      return;
    }
    this.authService.forgotPassword(this.email);
    this.email = '';
  }

}
