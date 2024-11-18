import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/api/products.service';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Fetch product by ID from the route
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productsService.getProductById(productId).subscribe({
        next: (data) => {
          this.product = data;
          this.generateStars(this.product.rating.rate);
        },
        error: (err) => {
          console.error('Error fetching product:', err);
        },
      });
    }
  }

  stars: ('filled' | 'half' | 'empty')[] = [];

  generateStars(rating: number): void {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        this.stars.push('filled');
      } else if (rating > i - 1) {
        this.stars.push('half');
      } else {
        this.stars.push('empty');
      }
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  getProductQuantity(productId: string): number {
    return this.cartService.getProductQuantity(productId);
  }
}
