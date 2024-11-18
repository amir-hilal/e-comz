import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<any[]>(this.loadCartFromLocalStorage());

  get items() {
    return this.cartItems.asReadonly();
  }

  get totalItems() {
    return computed(() =>
      this.cartItems().reduce((total, item) => total + item.quantity, 0)
    );
  }

  addToCart(product: any) {
    this.cartItems.update((currentItems) => {
      const updatedItems = this.addOrUpdateProduct(currentItems, product);
      this.saveCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  }

  removeOneFromCart(productId: string) {
    this.cartItems.update((currentItems) => {
      const updatedItems = this.decrementOrRemoveProduct(
        currentItems,
        productId
      );
      this.saveCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  }

  getProductQuantity(productId: string): number {
    const product = this.cartItems().find((item) => item.id === productId);
    return product ? product.quantity : 0;
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCartToLocalStorage([]);
  }

  private addOrUpdateProduct(cart: any[], product: any): any[] {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      return cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      return [...cart, { ...product, quantity: 1 }];
    }
  }

  private decrementOrRemoveProduct(cart: any[], productId: string): any[] {
    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        return cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return cart.filter((item) => item.id !== productId);
      }
    }
    return cart;
  }

  private loadCartFromLocalStorage(): any[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  private saveCartToLocalStorage(cart: any[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
