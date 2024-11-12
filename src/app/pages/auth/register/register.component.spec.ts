import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../shared/notification.services';
import { RegisterComponent } from './register.component';

class MockAuthService {
  register = jasmine.createSpy('register').and.returnValue(of(true));
  googleSignIn = jasmine.createSpy('googleSignIn').and.resolveTo(true);
}

class MockNotificationService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let notificationService: MockNotificationService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const breakpointObserverSpy = {
      observe: jasmine
        .createSpy('observe')
        .and.returnValue(of({ matches: false } as BreakpointState)),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useValue: routerSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    notificationService = TestBed.inject(
      NotificationService
    ) as unknown as MockNotificationService;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      username: '',
      email: '',
      password: '',
    });
  });

  it('should require username, email, and password to be valid', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalse();
    form.controls['username'].setValue('testUser');
    form.controls['email'].setValue('test@example.com');
    form.controls['password'].setValue('password123');
    expect(form.valid).toBeTrue();
  });

  it('should call AuthService.register and navigate on successful registration', () => {
    const form = component.registerForm;
    form.controls['username'].setValue('testUser');
    form.controls['email'].setValue('test@example.com');
    form.controls['password'].setValue('password123');
    component.onRegister();

    expect(authService.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'testUser'
    );
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Registration successful!'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should show error message if registration fails', () => {
    authService.register.and.returnValue(
      throwError({ message: 'Registration failed' })
    );
    component.onRegister();

    expect(notificationService.showError).toHaveBeenCalledWith(
      'Registration failed'
    );
  });

  it('should call authService.googleSignIn on loginWithGoogle', async () => {
    await component.loginWithGoogle();
    expect(authService.googleSignIn).toHaveBeenCalled();
  });

  it('should navigate to login page on goToLogin', () => {
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
