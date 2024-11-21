import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  constructor(public cartService: CartService, private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  removeItem(productId: string): void {
    this.cartService.removeOneFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  get totalPrice(): number {
    return this.cartService
      .items()
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
