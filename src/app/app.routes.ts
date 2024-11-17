import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthWrapperComponent } from './pages/auth/auth-wrapper.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SupportComponent } from './pages/support/support.component';
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
      {
        path: 'home',
        component: HomeComponent,
        data: { animation: 'HomePage' },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: { animation: 'AboutPage' },
      },
      {
        path: 'support',
        component: SupportComponent,
        data: { animation: 'SupportPage' },
      },

      {
        path: 'product/:id',
        component: ProductDetailsComponent,
        data: { animation: 'ProductDetailsPage' },
      },

      // { path: 'cart', component: CartComponent },
      // { path: 'product/:id', component: ProductDetailsComponent },
    ],
  },
];
