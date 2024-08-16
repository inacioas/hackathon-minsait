import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { AddProductComponent } from './add-product.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
  let mockProductService = jasmine.createSpyObj('ProductsService', [
    'updateProduct',
    'saveProduct',
  ]);

  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AddProductComponent>>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    matSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ProductsService, useValue: mockProductService },
        { provide: MatSnackBar, useValue: matSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the form', () => {
    // Arrange
    const data: Product = {
      title: 'Test Product',
      description: 'Test description',
      price: '19.99',
      category: 'Test category',
    };
    component.data = data;

    component.ngOnInit(); // Certifique-se de chamar ngOnInit para inicializar o formulário
    // Act
    fixture.detectChanges();

    // Assert
    expect(component.productForm.value).toEqual(data);
  });

  describe('should test add product functionality', () => {
    it('should call the saveProduct to add new product', () => {
      // Arrange
      const data: Product = {
        title: 'Test Product',
        description: 'Test description',
        price: '19.99',
        category: 'Test category',
      };
      component.productForm.patchValue(data);

      mockProductService.saveProduct.and.returnValue(of(data)); // Retorna um Observable válido

      // Act
      component.saveProduct();

      // Assert
      expect(mockProductService.saveProduct).toHaveBeenCalledWith(data);
    });

    it('should test the saveProduct for failure while add a new product', () => {
      // Arrange
      const data: Product = {
        id: '1',
        title: 'Test Product',
        description: 'Test description',
        price: '19.99',
        category: 'Test category',
      };
      component.data = data;
      component.ngOnInit(); // Certifique-se de chamar ngOnInit para inicializar o formulário
      fixture.detectChanges();

      // Verificando cada controle individualmente
      expect(component.productForm.get('title')?.value).toEqual(data.title);
      expect(component.productForm.get('description')?.value).toEqual(
        data.description
      );
      expect(component.productForm.get('price')?.value).toEqual(data.price);
      expect(component.productForm.get('category')?.value).toEqual(
        data.category
      );
    });

    it('should set the form controls to the correct values when data is provided', () => {
      const data: Product = {
        id: '1',
        title: 'Test Product',
        description: 'Test description',
        price: '19.99',
        category: 'Test category',
      };

      // Passando os dados para o componente
      component.data = data;

      // Chamando ngOnInit para inicializar o formulário
      component.ngOnInit();

      // Detectando mudanças no componente
      fixture.detectChanges();

      // Verificando cada controle individualmente
      expect(component.productForm.get('title')?.value).toEqual(data.title);
      expect(component.productForm.get('description')?.value).toEqual(
        data.description
      );
      expect(component.productForm.get('price')?.value).toEqual(data.price);
      expect(component.productForm.get('category')?.value).toEqual(
        data.category
      );
    });

    it('should call the saveProduct while editing the product', () => {
      // Arrange
      const data: Product = {
        id: '1',
        title: 'Test Product',
        description: 'Test description',
        price: '19.99',
        category: 'Test category',
      };
      component.data = data;
      // component.productForm.patchValue(data);
      component.ngOnInit(); // Certifique-se de chamar ngOnInit para inicializar o formulário
      fixture.detectChanges();

      mockProductService.updateProduct.and.returnValue(of({}));

      // Act
      component.saveProduct();

      // Assert
      expect(mockProductService.updateProduct).toHaveBeenCalledWith(data);
    });

    it('should test the saveProduct for failure while update a product', () => {
      const data: Product = {
        id: '1',
        title: 'Test Product',
        description: 'Test description',
        price: '19.99',
        category: 'Test category',
      };
      const error = new Error('Error while update a product');
      component.data = data;

      mockProductService.updateProduct.and.returnValue(throwError(() => error));
      component.productForm.patchValue(data);
      component.saveProduct();
      expect(mockProductService.updateProduct).toHaveBeenCalledWith(data);
      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Something went wrong!...',
        '',
        {
          duration: 3000,
        }
      );
    });
  });
});
