import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CategoriesService } from '../../services/api/categories.service';
import { ProductsService } from '../../services/api/products.service';
import { AuthService } from '../../services/auth/auth.service';
import { HomeComponent } from './home.component';

class MockAuthService {
  logout = jasmine.createSpy('logout').and.returnValue(of(null));
}

class MockProductsService {
  getProducts = jasmine.createSpy('getProducts').and.returnValue(
    of([
      {
        id: 1,
        title: 'Product 1',
        category: 'Category 1',
        description: 'Description 1',
        price: 10,
        image: 'image1.jpg',
      },
      {
        id: 2,
        title: 'Product 2',
        category: 'Category 2',
        description: 'Description 2',
        price: 20,
        image: 'image2.jpg',
      },
    ])
  );
}

class MockCategoriesService {
  getCategories = jasmine
    .createSpy('getCategories')
    .and.returnValue(of(['Category 1', 'Category 2', 'Category 3']));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: MockAuthService;
  let productsService: MockProductsService;
  let categoriesService: MockCategoriesService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ProductsService, useClass: MockProductsService },
        { provide: CategoriesService, useClass: MockCategoriesService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    productsService = TestBed.inject(
      ProductsService
    ) as unknown as MockProductsService;
    categoriesService = TestBed.inject(
      CategoriesService
    ) as unknown as MockCategoriesService;
    router = TestBed.inject(Router) as unknown as MockRouter;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(2); // Mocked products
  });

  it('should fetch categories on initialization', () => {
    expect(categoriesService.getCategories).toHaveBeenCalled();
    expect(component.categories().length).toBe(3); // Mocked categories
  });

  it('should set loading to false after fetching products', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should filter products based on search term', () => {
    component.searchTerm.set('Product 1');
    const filteredProducts = component.filteredProducts();
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].title).toBe('Product 1');
  });

  it('should call logout and navigate to login page', () => {
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
