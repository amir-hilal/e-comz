import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { CookieService } from 'ngx-cookie-service';
import { from, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = signal<firebase.User | null>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private cookieService: CookieService,
    private router: Router
  ) {
    const tokenExists = !!this.cookieService.get('idToken');
    if (tokenExists) {
      this.authState.set({} as firebase.User);
    }

    this.afAuth.authState.subscribe((user) => {
      this.authState.set(user);
      if (user) {
        user.getIdToken().then((token) => {
          if (this.cookieService.get('idToken') !== token) {
            this.cookieService.set('idToken', token, {
              secure: true,
              sameSite: 'Strict',
            });
          }
        });
      } else {
        this.cookieService.delete('idToken');
      }
    });
  }

  register(email: string, password: string) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      tap((userCredential) => {
        this.authState.set(userCredential.user);
        userCredential.user?.getIdToken().then((token) => {
          if (this.cookieService.get('idToken') !== token) {
            this.cookieService.set('idToken', token, {
              secure: true,
              sameSite: 'Strict',
            });
          }
        });
      })
    );
  }

  login(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      tap((userCredential) => {
        this.authState.set(userCredential.user);
        userCredential.user?.getIdToken().then((token) => {
          if (this.cookieService.get('idToken') !== token) {
            this.cookieService.set('idToken', token, {
              secure: true,
              sameSite: 'Strict',
            });
          }
        });
        this.router.navigate(['/home']);
      })
    );
  }

  logout() {
    return from(this.afAuth.signOut()).pipe(
      tap(() => {
        this.authState.set(null);
        this.cookieService.delete('idToken');
      })
    );
  }

  getToken(): Promise<string | null> {
    const token = this.cookieService.get('idToken');
    return Promise.resolve(token || null);
  }

  isAuthenticated(): boolean {
    return this.authState() !== null || !!this.cookieService.get('idToken');
  }
}
