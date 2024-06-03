import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../environments/environment';

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

  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);

    if (credential.user) {
      const token = await credential.user.getIdToken();
      await this.registerUserIfNew(credential.user, token);
    }
  }

  private async registerUserIfNew(user: firebase.User, token: string) {
    console.log('registering');

    const userCheckUrl = `https://tetriplan.onrender.com/api/users/${user.uid}`;

    try {
      await axios.get(userCheckUrl);
      console.log('User exists on server');
      this.router.navigate(['/home']);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log('adding user');

        const userData = {
          username: user.uid,
          email: user.email,
          fullName: user.displayName,
        };

        try {
          await axios.post(
            `https://tetriplan.onrender.com/api/users/${userData.username}`,
            userData
            // {
            //   headers: { Authorization: `Bearer ${token}` },
            // }
          );
          console.log('User registered on server');
          this.router.navigate(['/home']);
        } catch (registrationError) {
          console.error('Registration error', registrationError);
        }
      } else {
        console.error('Error checking user existence', error);
      }
    }
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

        await axios.post(
          `https://tetriplan.onrender.com/api/users/${userData.username}`,
          userData
        );

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

  getHuggingFaceToken(): string {
    const token = environment.huggingFaceApiToken;
    if (!token) {
      throw new Error(
        'Hugging Face API token is not set in environment variables'
      );
    }
    return token;
  }
}
