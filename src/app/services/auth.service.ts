import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<firebase.User | null>(null);
  authState$ = this.authState.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      this.authState.next(user);
    });
  }

  register(email: string, password: string) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(tap((userCredential) => this.authState.next(userCredential.user)));
  }

  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      tap((userCredential) => this.authState.next(userCredential.user))
    );
  }

  logout() {
    return from(this.afAuth.signOut()).pipe(
      tap(() => this.authState.next(null))
    );
  }
}
