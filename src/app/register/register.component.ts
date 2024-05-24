import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Adjust the path if necessary

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  email : string = '';
  password : string = '';
  displayName: string = '';

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  register() {

    if(this.email == '') {
      alert('Please enter email');
      return;
    }

    if(this.password == '') {
      alert('Please enter password');
      return;
    }
    if (this.displayName === '') {
      alert('Please enter full name');
      return;
    }

    this.auth.register(this.email, this.password,this.displayName);
      
    this.email = '';
    this.password = '';
    this.displayName= '';

  }

}
