import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log(isAuthenticated);
    if (
      isAuthenticated &&
      (state.url === '/auth/login' || state.url === '/auth/register')
    ) {
      console.log('should redirect to home');
      this.router.navigate(['/home']);
      return false;
    }

    if (
      !isAuthenticated &&
      state.url !== '/auth/login' &&
      state.url !== '/auth/register'
    ) {
      this.cookieService.delete('idToken');
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
