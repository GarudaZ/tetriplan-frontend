import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$!: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState;
  }

  getUserInfo(): Observable<firebase.User | null> {
    return this.user$;
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }

  async register(email: string, password: string, fullName: string) {
    try {
      const res = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (res.user) {
        await res.user.updateProfile({ displayName: fullName });

        const userData = {
          username: res.user.uid,
          email: res.user.email,
          fullName: fullName,
        };

        await axios.post(`/api/users/${userData.username}`, userData);

        this.router.navigate(['/login']);
      }
    } catch (err: unknown) {
      if (
        (err as firebase.auth.AuthError).code === 'auth/email-already-in-use'
      ) {
        throw new Error(
          'Email is already in use. Please use a different email.'
        );
      } else if (axios.isAxiosError(err)) {
        alert(err.response?.data.message || 'Registration failed');
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unexpected error occurred');
      }
      this.router.navigate(['/register']);
    }
  }

  async login(email: string, password: string) {
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('token', 'true');

      if (res.user) {
        this.router.navigate(['home']);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unexpected error occurred');
      }
      this.router.navigate(['/login']);
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.router.navigate(['/login']);
    } catch (err) {
      alert('Something went wrong');
    }
  }

  logOut() {
    this.afAuth.signOut();
  }
}
