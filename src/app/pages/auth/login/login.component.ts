import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../shared/notification.services';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isSmallScreen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
      });
  }

  async onLogin() {
    const { identifier, password } = this.loginForm.value;

    try {
      await this.authService.loginWithUsernameOrEmail(identifier, password);
      this.notificationService.showSuccess('Login successful!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.notificationService.showError(error.message);
      console.error('Login error:', error);
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.googleSignIn();
      console.log('Google sign-in successful');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
