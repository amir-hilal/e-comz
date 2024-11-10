import { Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth/auth-wrapper.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthWrapperComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { animation: 'LoginPage' },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { animation: 'RegisterPage' },
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
