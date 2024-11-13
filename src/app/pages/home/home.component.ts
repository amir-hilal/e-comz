import { animate, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
      transition('* => *', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent {
  products = signal<any[]>([]);
  filteredProducts = computed(() =>
    this.products().filter((product) =>
      product.title.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );
  loading = signal<boolean>(false);
  searchTerm = signal<string>('');
  selectedProduct = signal<any | null>(null);
  recommendedProduct = signal<any | null>(null);
  animationState = signal<boolean>(true);

  categories: string[] = [
    'Electronics',
    'Jewelry',
    'Men Clothing',
    'Women Clothing',
  ];

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
      this.products.set(data);
      this.selectRandomRecommendedProduct();
      this.loading.set(false);
    });
  }

  selectRandomRecommendedProduct() {
    const productsList = this.products();
    if (productsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * productsList.length);
      this.recommendedProduct.set(productsList[randomIndex]);
      this.selectedProduct.set(this.recommendedProduct());
    }
  }

  selectProduct(product: any) {
    this.animationState.set(!this.animationState()); // Toggle the animation state to trigger reanimation
    this.selectedProduct.set(product);
    this.recommendedProduct.set(null); // Clear the recommended product
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
