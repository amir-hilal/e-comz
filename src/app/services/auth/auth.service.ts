import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom, from, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = signal<any | null>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private cookieService: CookieService,
    private router: Router,
    private firestore: AngularFirestore
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

    return from(signInWithPopup(auth, provider)).pipe(
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
        } else {
          console.error('No user credential returned from Google sign-in');
        }
      }),
      tap({
        error: (error) => {
          console.error('Google sign-in error:', error);
        },
      })
    );
  }

  register(email: string, password: string, username: string) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      tap(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          this.authState.set(user);
          user.getIdToken().then((token) => {
            if (this.cookieService.get('idToken') !== token) {
              this.cookieService.set('idToken', token, {
                secure: true,
                sameSite: 'Strict',
              });
            }
          });
          await this.firestore.collection('users').doc(user.uid).set({
            username: username,
            email: email,
          });
        }
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
      })
    );
  }

  async loginWithUsernameOrEmail(identifier: string, password: string) {
    let email = identifier;

    if (!identifier.includes('@')) {
      const usersRef = this.firestore.collection<User>('users', (ref) =>
        ref.where('username', '==', identifier)
      );

      try {
        const querySnapshot = await firstValueFrom(usersRef.get());

        if (!querySnapshot?.empty) {
          email = querySnapshot.docs[0].data().email;
        } else {
          throw new Error('Username not found');
        }
      } catch (error) {
        console.error('Error querying username:', error);
        throw new Error('Username lookup failed');
      }
    }

    // Use email and password for login
    return this.login(email, password);
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
