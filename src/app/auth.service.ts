import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';


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

  // Sign in with Google
  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }

  // Register method
  register(email: string, password: string, fullName: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password).then((res) => {
      if (res.user) {
        res.user.updateProfile({
          displayName: fullName,
        }).then(() => {
          // Registration successful
          this.router.navigate(['/login']);
        }).catch((err) => {
          alert(err.message);
          this.router.navigate(['/register']);
        });
      }
    }).catch((err) => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }

  // Login method
  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
      localStorage.setItem('token', 'true');

      if (res.user) {
        this.router.navigate(['home']);
      }
    }).catch((err) => {
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }

  logOut() {
    this.afAuth.signOut();
  }
}