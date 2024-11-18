import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<any[]>([]);

  get items() {
    return this.cartItems.asReadonly();
  }

  get totalItems() {
    return computed(() => this.cartItems().length);
  }

  addToCart(product: any) {
    this.cartItems.update((currentItems) => [...currentItems, product]);
  }

  removeFromCart(productId: string) {
    this.cartItems.update((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
