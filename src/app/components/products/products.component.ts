import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/api/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products = signal<any[]>([]);
  loading = signal<boolean>(false);
  searchLoading = signal<boolean>(false);
  searchTerm = signal<string>('');
  filteredProducts = computed(() => {
    const searchValue = this.searchTerm().toLowerCase();
    return this.products().filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
  });

  skeletonArray = Array(9).fill(0); // Skeleton placeholders (3x3 grid)

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading.set(true);
    this.productsService.getProducts().subscribe({
      next: (data: any) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onSearchChange() {
    this.searchLoading.set(true);
    setTimeout(() => {
      this.searchLoading.set(false);
    }, 500);
  }

  navigateToProduct(productId: string) {
    this.router.navigate([`/product/${productId}`]);
  }
}
