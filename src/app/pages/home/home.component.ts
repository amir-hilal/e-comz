import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/api/products.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  products = signal<any[]>([]);
  loading = signal<boolean>(false);
  searchTerm = signal<string>('');
  filteredProducts = computed(() =>
    this.products().filter((product) =>
      product.title.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );
  categories: string[] = [
    'Electronics',
    'Jewelry',
    'Men Clothing',
    'Women Clothing',
  ];
  title = 'Welcome to E-Comz';
  constructor(
    private authService: AuthService,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading.set(true);

    this.productsService.getProducts().subscribe((data: any) => {
      this.products.update((prevProducts) => [...prevProducts, ...data]);
      this.loading.set(false);
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
