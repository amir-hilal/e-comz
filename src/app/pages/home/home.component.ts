import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsComponent } from '../../components/products/products.component';
import { CategoriesService } from '../../services/api/categories.service';
import { ProductsService } from '../../services/api/products.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductsComponent],
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
  showFeaturedProduct = signal<boolean>(false);
  imageLoaded = signal<boolean>(false);

  quotes: string[] = [
    'Premium products that elevate your lifestyle',
    'Elevate your space unmatched quality.',
    'Find comfort and style with our collection.',
  ];
  currentQuote: string = '';
  currentIndex: number = 0;
  isDeleting: boolean = false;
  typingSpeed: number = 60;
  deletingSpeed: number = 30;
  delayBetweenQuotes: number = 2000;

  categories = signal<string[]>([]);

  constructor(
    private authService: AuthService,
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.fetchCategories();
    this.startTypingEffect();
  }

  fetchProducts() {
    this.loading.set(true);

    this.productsService.getProducts().subscribe({
      next: (data: any) => {
        this.products.set(data);
        this.loading.set(false);
        this.selectRandomRecommendedProduct();
        this.startFeaturedProductRotation();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
  fetchCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data: string[]) => {
        this.categories.set(data);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  startTypingEffect() {
    const quote = this.quotes[this.currentIndex];
    if (!this.isDeleting) {
      // Typing
      this.currentQuote = quote.substring(0, this.currentQuote.length + 1);
      if (this.currentQuote === quote) {
        this.isDeleting = true;
        setTimeout(() => this.startTypingEffect(), this.delayBetweenQuotes);
        return;
      }
    } else {
      // Deleting
      this.currentQuote = quote.substring(0, this.currentQuote.length - 1);
      if (this.currentQuote === '') {
        this.isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length; // Cycle through quotes
      }
    }
    setTimeout(
      () => this.startTypingEffect(),
      this.isDeleting ? this.deletingSpeed : this.typingSpeed
    );
  }

  selectRandomRecommendedProduct() {
    const productsList = this.products();
    if (productsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * productsList.length);
      this.recommendedProduct.set(productsList[randomIndex]);
      this.imageLoaded.set(false);
    }
  }

  startFeaturedProductRotation() {
    this.selectRandomRecommendedProduct();
    this.showFeaturedProduct.set(true);

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
