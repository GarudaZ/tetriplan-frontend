import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

export const authGuard: CanActivateFn = async (route, state) => {
  const angularFireAuth = inject(AngularFireAuth);
  const router = inject(Router);

  // const user = await angularFireAuth.currentUser;
  const user = await new Promise<firebase.User | null>((resolve) => {
    angularFireAuth.onAuthStateChanged(resolve);
  });

  const isLoggedIn = !!user;
  if (!isLoggedIn) {
    router.navigate(['/login']); // Redirect to login page if not authenticated
  }
  return isLoggedIn;
};
