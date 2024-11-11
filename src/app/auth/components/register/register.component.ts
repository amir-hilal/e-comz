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
import { NotificationService } from '../../../shared/notification.services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isSmallScreen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        this.isSmallScreen = state.matches;
      });
  }

  onRegister() {
    const { email, password, username } = this.registerForm.value;
    this.authService.register(email, password, username).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registration successful!');
        this.router.navigate(['/auth/login']);
      },
      error: (error: any) => {
        this.notificationService.showError(error.message);
        console.error('Registration error:', error);
      },
    });
  }

  async loginWithGoogle() {
    try {
      await this.authService.googleSignIn();
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
