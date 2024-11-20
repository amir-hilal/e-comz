import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { CartComponent } from './cart.component';

class MockCartService {
  private mockItems = [
    { id: '1', title: 'Product 1', price: 100, quantity: 2, image: 'img1.jpg' },
    { id: '2', title: 'Product 2', price: 200, quantity: 1, image: 'img2.jpg' },
  ];

  items = jasmine.createSpy('items').and.returnValue(this.mockItems);
  removeOneFromCart = jasmine.createSpy('removeOneFromCart');
  clearCart = jasmine.createSpy('clearCart');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: MockCartService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useClass: MockCartService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on `navigateToHome` call', () => {
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should calculate the total price correctly', () => {
    expect(component.totalPrice).toBe(400); // (100 * 2) + (200 * 1)
  });

  it('should call removeItem on `removeItem` call', () => {
    component.removeItem('1');
    expect(cartService.removeOneFromCart).toHaveBeenCalledWith('1');
  });

  it('should call clearCart on `clearCart` call', () => {
    component.clearCart();
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('should display the empty cart message when cart is empty', () => {
    cartService.items.and.returnValue([]);
    fixture.detectChanges();
    const emptyCartMessage = fixture.nativeElement.querySelector('.empty-cart');
    expect(emptyCartMessage).toBeTruthy();
  });

  it('should display cart items when cart is not empty', () => {
    const cartItems = fixture.nativeElement.querySelectorAll('.cart-item');
    expect(cartItems.length).toBe(2); // Based on the mock data
  });
});
