import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Product } from '../models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test getProducts', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'Product 1',
        price: '100',
        description: 'Description 1',
        category: 'Category 1',
        image: 'Image 1',
      },
      {
        id: '2',
        title: 'Product 2',
        price: '200',
        description: 'Description 2',
        category: 'Category 2',
        image: 'Image 2',
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpController.expectOne(`${(service as any).baseAPI}products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should test saveProducts', () => {
    const mockProduct: Product = {
      id: '1',
      title: 'Product 1',
      price: '100',
      description: 'Description 1',
      category: 'Category 1',
      image: 'Image 1',
    };

    service.saveProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpController.expectOne(`${(service as any).baseAPI}products`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should test updateProduct', () => {
    const mockProduct: Product = {
      id: '1',
      title: 'Product 1',
      price: '100',
      description: 'Description 1',
      category: 'Category 1',
      image: 'Image 1',
    };

    service.updateProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpController.expectOne(
      `${(service as any).baseAPI}products/${mockProduct.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should test deleteProduct', () => {
    const mockProduct: Product = {
      id: '1',
      title: 'Product 1',
      price: '100',
      description: 'Description 1',
      category: 'Category 1',
      image: 'Image 1',
    };

    service.deleteProduct(Number(mockProduct.id)).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpController.expectOne(
      `${(service as any).baseAPI}products/${mockProduct.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProduct);
  });
});
