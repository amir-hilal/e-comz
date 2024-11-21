import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../shared/notification.services';
import { LoginComponent } from './login.component';

// Mock services
class MockAuthService {
  loginWithUsernameOrEmail = jasmine
    .createSpy('loginWithUsernameOrEmail')
    .and.returnValue(Promise.resolve());
  googleSignIn = jasmine.createSpy('googleSignIn').and.resolveTo(true);
}

class MockNotificationService {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
      imports: [LoginComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: Router, useValue: routerSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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
    expect(component.loginForm.value).toEqual({
      identifier: '',
      password: '',
    });
  });

  it('should require identifier and password to be valid', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalse();

    form.controls['identifier'].setValue('testUser');
    form.controls['password'].setValue('password123');
    expect(form.valid).toBeTrue();
  });

  it('should call AuthService.loginWithUsernameOrEmail and navigate on successful login', async () => {
    const form = component.loginForm;
    form.controls['identifier'].setValue('testUser');
    form.controls['password'].setValue('password123');

    await component.onLogin();

    expect(authService.loginWithUsernameOrEmail).toHaveBeenCalledWith(
      'testUser',
      'password123'
    );
    expect(notificationService.showSuccess).toHaveBeenCalledWith(
      'Login successful!'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error message if login fails', async () => {
    authService.loginWithUsernameOrEmail.and.returnValue(
      Promise.reject({ message: 'Login failed' })
    );

    const form = component.loginForm;
    form.controls['identifier'].setValue('testUser');
    form.controls['password'].setValue('password123');

    await component.onLogin();

    expect(notificationService.showError).toHaveBeenCalledWith('Login failed');
  });

  it('should call authService.googleSignIn on loginWithGoogle', async () => {
    await component.loginWithGoogle();
    expect(authService.googleSignIn).toHaveBeenCalled();
  });

  it('should navigate to register page on goToRegister', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/register']);
  });
});
