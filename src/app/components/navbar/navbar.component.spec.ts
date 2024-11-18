import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { NavbarComponent } from './navbar.component';

class MockAuthService {
  logout = jasmine.createSpy('logout').and.returnValue(of(null));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isMobile to true if screen width is <= 768', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(768);
    component.checkScreenSize();
    expect(component.isMobile).toBeTrue();
  });

  it('should set isMobile to false if screen width is > 768', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    component.checkScreenSize();
    expect(component.isMobile).toBeFalse();
  });

  it('should call AuthService.logout and navigate to login on logout', () => {
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should render mobile menu if isMobile is true', () => {
    component.isMobile = true;
    fixture.detectChanges();
    const mobileMenu = fixture.nativeElement.querySelector('.mobile-actions');
    const navLinks = fixture.nativeElement.querySelector('.nav-links');
    expect(mobileMenu).toBeTruthy();
    expect(navLinks).toBeFalsy();
  });

  it('should render regular navigation links if isMobile is false', () => {
    component.isMobile = false;
    fixture.detectChanges();
    const mobileMenu = fixture.nativeElement.querySelector('.mobile-actions');
    const navLinks = fixture.nativeElement.querySelector('.nav-links');
    expect(navLinks).toBeTruthy();
    expect(mobileMenu).toBeFalsy();
  });
});
