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
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
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
  recommendedProduct = signal<any | null>(null);
  showFeaturedProduct = signal<boolean>(false); // Control visibility for animation

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
    this.startFeaturedProductRotation();
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
    }
  }

  startFeaturedProductRotation() {
    setInterval(() => {
      this.showFeaturedProduct.set(false);

      setTimeout(() => {
        this.selectRandomRecommendedProduct();
        this.showFeaturedProduct.set(true);
      }, 500);
    }, 9000); 
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
