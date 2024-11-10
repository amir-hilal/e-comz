import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = signal<firebase.User | null>(null); // Auth state managed with signal

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => this.authState.set(user));
  }

  register(email: string, password: string) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(tap((userCredential) => this.authState.set(userCredential.user)));
  }

  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      tap((userCredential) => this.authState.set(userCredential.user))
    );
  }

  logout() {
    return from(this.afAuth.signOut()).pipe(
      tap(() => this.authState.set(null))
    );
  }

  getToken(): Promise<string | null> {
    const user = this.authState();
    if (user) {
      return user.getIdToken();
    }
    return Promise.resolve(null);
  }

  isAuthenticated(): boolean {
    return !!this.authState();
  }
}
