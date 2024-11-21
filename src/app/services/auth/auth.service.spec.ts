import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

class MockAngularFireAuth {
  authState = of(null);
  createUserWithEmailAndPassword = jasmine
    .createSpy('createUserWithEmailAndPassword')
    .and.returnValue(
      Promise.resolve({
        user: {
          uid: 'testUid',
          getIdToken: () => Promise.resolve('mockToken'),
        },
      })
    );
  signInWithEmailAndPassword = jasmine
    .createSpy('signInWithEmailAndPassword')
    .and.returnValue(
      Promise.resolve({
        user: {
          uid: 'testUid',
          getIdToken: () => Promise.resolve('mockToken'),
        },
      })
    );
  signOut = jasmine.createSpy('signOut').and.returnValue(Promise.resolve());
}

class MockAngularFirestore {
  collection = jasmine.createSpy('collection').and.returnValue({
    doc: jasmine.createSpy('doc').and.returnValue({
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    }),
  });
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockCookieService {
  get = jasmine.createSpy('get').and.returnValue('');
  set = jasmine.createSpy('set');
  delete = jasmine.createSpy('delete');
}

describe('AuthService', () => {
  let service: AuthService;
  let afAuth: MockAngularFireAuth;
  let firestore: MockAngularFirestore;
  let router: MockRouter;
  let cookieService: MockCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useClass: MockAngularFireAuth },
        { provide: AngularFirestore, useClass: MockAngularFirestore },
        { provide: Router, useClass: MockRouter },
        { provide: CookieService, useClass: MockCookieService },
      ],
    });
    service = TestBed.inject(AuthService);
    afAuth = TestBed.inject(AngularFireAuth) as unknown as MockAngularFireAuth;
    firestore = TestBed.inject(
      AngularFirestore
    ) as unknown as MockAngularFirestore;
    router = TestBed.inject(Router) as unknown as MockRouter;
    cookieService = TestBed.inject(
      CookieService
    ) as unknown as MockCookieService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user and set Firestore data', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const username = 'testest';

    await service.register(email, password, username).toPromise();

    expect(afAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      email,
      password
    );
    expect(firestore.collection).toHaveBeenCalledWith('users');
    expect(
      firestore.collection('users').doc('testUid').set
    ).toHaveBeenCalledWith({
      username,
      email,
    });
  });

  it('should login with email and password and set auth state', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    await service.login(email, password).toPromise();

    expect(afAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      email,
      password
    );
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should logout and clear auth state', async () => {
    await service.logout().toPromise();

    expect(afAuth.signOut).toHaveBeenCalled();
    expect(cookieService.delete).toHaveBeenCalledWith('idToken');
  });
});
