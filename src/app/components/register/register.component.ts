import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path if necessary

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  displayName: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  async register() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }
    if (this.displayName === '') {
      alert('Please enter full name');
      return;
    }

    try {
      await this.auth.register(this.email, this.password, this.displayName);
      alert('User registered successfully');

      this.email = '';
      this.password = '';
      this.displayName = '';
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unexpected error occurred');
      }
      // alert('Error registering user');
    }
  }
}
