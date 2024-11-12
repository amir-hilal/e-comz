import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProductsService } from '../../services/api/products.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private productsService: ProductsService
  ) {}
  products: any[] = [];
  categories: string[] = [
    'Electronics',
    'Jewelry',
    'Men Clothing',
    'Women Clothing',
  ];

  title = 'Welcome to E-Comz';

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productsService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }
  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => console.error('Logout error:', error),
    });
  }
}
