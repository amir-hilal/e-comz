import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from '../../services/api/products.service';
import { CartService } from '../../services/cart/cart.service';
import { ProductDetailsComponent } from './product-details.component';

class MockProductsService {
  getProductById = jasmine.createSpy('getProductById').and.returnValue(
    of({
      id: '1',
      name: 'Test Product',
      rating: { rate: 4.5 },
    })
  );
}

class MockCartService {
  addToCart = jasmine.createSpy('addToCart');
  getProductQuantity = jasmine
    .createSpy('getProductQuantity')
    .and.returnValue(1);
}

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productsService: MockProductsService;
  let cartService: MockCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: ProductsService, useClass: MockProductsService },
        { provide: CartService, useClass: MockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(
      ProductsService
    ) as unknown as MockProductsService;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the product and generate stars on init', () => {
    expect(productsService.getProductById).toHaveBeenCalledWith('1');
    expect(component.product).toEqual({
      id: '1',
      name: 'Test Product',
      rating: { rate: 4.5 },
    });
    expect(component.stars).toEqual([
      'filled',
      'filled',
      'filled',
      'filled',
      'half',
    ]);
  });

  it('should add the product to the cart', () => {
    component.addToCart();
    expect(cartService.addToCart).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Product',
      rating: { rate: 4.5 },
    });
  });

  it('should get the product quantity from the cart service', () => {
    const quantity = component.getProductQuantity('1');
    expect(cartService.getProductQuantity).toHaveBeenCalledWith('1');
    expect(quantity).toBe(1);
  });
});
