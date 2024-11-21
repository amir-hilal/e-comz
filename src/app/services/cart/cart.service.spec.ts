import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart(); // Reset cart before each test
    spyOn(localStorage, 'setItem'); // Spy on localStorage
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new product to the cart', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(1);
  });

  it('should update quantity if the product already exists in the cart', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });

    expect(service.items()[0].quantity).toBe(2);
  });

  it('should correctly calculate the total number of items in the cart', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    service.addToCart({ id: '2', title: 'Product 2', price: 200 });
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });

    expect(service.totalItems()).toBe(3); // 2 for Product 1 and 1 for Product 2
  });

  it('should remove a product from the cart when quantity is decremented to 0', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    service.removeOneFromCart('1');

    expect(service.items().length).toBe(0);
  });

  it('should decrement the quantity of an existing product', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    service.removeOneFromCart('1');

    expect(service.items()[0].quantity).toBe(1);
  });

  it('should clear the cart when `clearCart` is called', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });
    service.clearCart();

    expect(service.items().length).toBe(0);
  });

  it('should save cart to localStorage when updated', () => {
    service.addToCart({ id: '1', title: 'Product 1', price: 100 });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ id: '1', title: 'Product 1', price: 100, quantity: 1 }])
    );
  });
});
