import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductsService } from '../../services/api/products.service';
import { ProductsComponent } from './products.component';

class MockProductsService {
  getProducts = jasmine.createSpy('getProducts').and.returnValue(
    of([
      {
        id: 1,
        title: 'Product 1',
        category: 'Category A',
        price: 100,
        image: 'image1.jpg',
      },
      {
        id: 2,
        title: 'Product 2',
        category: 'Category B',
        price: 200,
        image: 'image2.jpg',
      },
      {
        id: 3,
        title: 'Product 3',
        category: 'Category A',
        price: 150,
        image: 'image3.jpg',
      },
    ])
  );
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: MockProductsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [{ provide: ProductsService, useClass: MockProductsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(
      ProductsService
    ) as unknown as MockProductsService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(3); // Mocked products length
  });

  it('should set loading to false after fetching products', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should filter products based on search term', () => {
    component.searchTerm.set('Product 1');
    fixture.detectChanges(); // Trigger re-evaluation of signals
    const filteredProducts = component.filteredProducts();
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].title).toBe('Product 1');
  });

  it('should show loading skeletons when loading is true', () => {
    component.loading.set(true);
    fixture.detectChanges(); // Update DOM
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-card');
    expect(skeletons.length).toBe(9); // 9 skeleton placeholders
  });

  it('should hide loading skeletons when loading is false', () => {
    component.loading.set(false);
    fixture.detectChanges(); // Update DOM
    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-card');
    expect(skeletons.length).toBe(0); // No skeletons when not loading
  });

  it('should display product cards when not loading', () => {
    component.loading.set(false);
    fixture.detectChanges(); // Update DOM
    const productCards =
      fixture.nativeElement.querySelectorAll('.product-card');
    expect(productCards.length).toBe(3); // Mocked products length
  });

  it('should call onSearchChange when the search term changes', () => {
    spyOn(component, 'onSearchChange').and.callThrough();
    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector('.search-bar input');
    inputElement.value = 'Product 2';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.onSearchChange).toHaveBeenCalled();
    expect(component.searchTerm()).toBe('Product 2');
  });

  it('should set searchLoading to true and then false after a delay in onSearchChange', (done) => {
    component.onSearchChange();
    expect(component.searchLoading()).toBeTrue();

    setTimeout(() => {
      expect(component.searchLoading()).toBeFalse();
      done();
    }, 500);
  });
});
