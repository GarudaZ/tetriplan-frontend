import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-signin',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(public angularFireAuth: AngularFireAuth) {}
  logOut() {
    this.angularFireAuth.signOut();
  }
}
