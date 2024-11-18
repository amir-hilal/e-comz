import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthWrapperComponent } from './pages/auth/auth-wrapper.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './services/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthWrapperComponent,
    canActivate: [AuthGuard],
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
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      // { path: 'cart', component: CartComponent },
      // { path: 'product/:id', component: ProductDetailsComponent },
    ],
  },
];
