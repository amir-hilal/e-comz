import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { CookieService } from 'ngx-cookie-service';
import { from, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = signal<any | null>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private cookieService: CookieService,
    private router: Router
  ) {
    const tokenExists = !!this.cookieService.get('idToken');
    if (tokenExists) {
      this.authState.set({});
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

  googleSignIn() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(auth, provider))
      .pipe(
        tap((userCredential) => {
          if (userCredential && userCredential.user) {
            this.authState.set(userCredential.user);

            userCredential.user.getIdToken().then((token) => {
              if (this.cookieService.get('idToken') !== token) {
                this.cookieService.set('idToken', token, {
                  secure: true,
                  sameSite: 'Strict',
                });
              }
            });

            this.router.navigate(['/home']);
          } else {
            console.error('No user credential returned from Google sign-in');
          }
        }),
        tap({
          error: (error) => {
            console.error('Google sign-in error:', error);
          },
        })
      )
      .subscribe({
        next: () => {
          console.log('Google sign-in and navigation process completed.');
        },
        error: (error) => {
          console.error('Error in Google sign-in observable chain:', error);
        },
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
