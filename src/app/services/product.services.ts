import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import {
  IParams,
  Product,
  ProductCategories,
  ProductResponce,
} from '../models/product.type';

import { BASE_URL } from '../constants';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_ENDPOINT = BASE_URL;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();
  products$ = this.productsSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();
  constructor(private http: HttpClient) {}

  // Create a new product
  createProduct(product: Product) {
    this.http.post<Product>(`${this.API_ENDPOINT}/products/add`, product, {
      headers: { 'Content-Type': 'application/json' },
    });
    this.productsSubject.next([product, ...this.productsSubject.getValue()]);
  }

  getProducts(queryParams: string): void {
    this.loadingSubject.next(true);
    console.log({queryParams});
    
    this.http
      .get<ProductResponce>(`${this.API_ENDPOINT}/products?${queryParams}`)
      .subscribe((res) => {
        this.productsSubject.next(res.products);
        this.totalSubject.next(res.total);
        this.loadingSubject.next(false);
      });
  }
  getProduct(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.API_ENDPOINT}/products/${id}`);
  }

  updateProduct(id: number, updatedData: Partial<Product>) {
    const products = this.productsSubject.getValue();
    const nextProduct = products.find((product) => product.id === id);
    const payload = { ...updatedData, id: undefined };
    if (nextProduct) {
      this.http
        .put(`${this.API_ENDPOINT}/products/${id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        })
        .subscribe({
          next: (res) => {
            const updatedProductFromApi: Product = {
              ...nextProduct,
              ...res,
            };
            const newProducts = products.map((product) =>
              product.id === id ? updatedProductFromApi : product
            );
            this.productsSubject.next(newProducts);
          },
          error: (err: unknown) => {
            console.error('Failed to update product:', err);
          },
        });
    } else {
      console.error(`Product with id: ${id} not found`);
    }
  }

  deleteProductById(id: number) {
    this.productsSubject.next(
      this.productsSubject.getValue().filter((product) => product.id !== id)
    );
  }

  // Search products
  searchProducts({
    query,
    limit,
    skip,
    sortOrder,
  }: IParams): Observable<Product[]> {
    this.loadingSubject.next(true);
    return this.http
      .get<ProductResponce>(
        `${this.API_ENDPOINT}/products/search?q=${query}&limit=${limit}&skip=${skip}&sortBy=title&order=${sortOrder}`
      )
      .pipe(
        map((res) => res.products),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        }),
        map((products) => {
          this.productsSubject.next(products);
          this.loadingSubject.next(false);
          return products;
        })
      );
  }
  // Get products by category
  getProductsByCategory(
    category: string,
    queryParams: string
  ): Observable<Product[]> {
    this.loadingSubject.next(true);
    return this.http
      .get<{ products: Product[] }>(
        `${this.API_ENDPOINT}/products/category/${category}?${queryParams}`
      )
      .pipe(
        map((res: any) => res.products),
        catchError((error) => {
          this.loadingSubject.next(false);
          throw error;
        }),
        map((products) => {
          this.productsSubject.next(products);
          this.loadingSubject.next(false);
          return products;
        })
      );
  }
  categories(): Observable<ProductCategories[]> {
    return this.http.get<ProductCategories[]>(
      `${this.API_ENDPOINT}/products/categories`
    );
  }
  // Load more products (load more behavior is similar to `getProducts`)
  loadMore(queryParams: string): void {
    this.getProducts(queryParams);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, map, catchError } from 'rxjs';
// import {
//   IParams,
//   Product,
//   ProductCategories,
//   ProductResponce,
// } from '../models/product.type';
// import { BASE_URL } from '../constants';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductService {
//   private readonly API_ENDPOINT = BASE_URL;
//   private productsSubject = new BehaviorSubject<Product[]>([]);
//   private loadingSubject = new BehaviorSubject<boolean>(false);

//   products$ = this.productsSubject.asObservable();
//   isLoading$ = this.loadingSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   // Fetch all products
//   getProducts({ limit, skip, sortOrder }: IParams): void {
//     this.loadingSubject.next(true);

//     const queryParams = new URLSearchParams();

//     if (limit !== undefined) queryParams.append('limit', String(limit));
//     if (skip !== undefined) queryParams.append('skip', String(skip));
//     if (sortOrder) {
//       queryParams.append('sortBy', 'title');
//       queryParams.append('order', sortOrder);
//     }

//     this.http
//       .get<ProductResponce>(`${this.API_ENDPOINT}/products?${queryParams.toString()}`)
//       .subscribe((res) => {
//         this.productsSubject.next(res.products);
//         this.loadingSubject.next(false);
//       });
//   }

//   // Fetch products by category
//   getProductsByCategory(category: string): Observable<Product[]> {
//     this.loadingSubject.next(true);
//     return this.http
//       .get<{ products: Product[] }>(
//         `${this.API_ENDPOINT}/products/category/${category}`
//       )
//       .pipe(
//         map((res) => res.products),
//         catchError((error) => {
//           this.loadingSubject.next(false);
//           throw error;
//         }),
//         map((products) => {
//           this.productsSubject.next(products);
//           this.loadingSubject.next(false);
//           return products;
//         })
//       );
//   }

//   // Search for products by query
//   searchProducts({
//     query,
//     limit,
//     skip,
//     sortOrder,
//   }: IParams): Observable<Product[]> {
//     console.log({ query, limit, skip });

//     this.loadingSubject.next(true);
//     return this.http
//       .get<ProductResponce>(
//         `${this.API_ENDPOINT}/products/search?q=${query}&limit=${limit}&${skip}&sortBy=title&order=${sortOrder}`
//       )
//       .pipe(
//         map((res) => res.products),
//         catchError((error) => {
//           this.loadingSubject.next(false);
//           throw error;
//         }),
//         map((products) => {
//           this.productsSubject.next(products);
//           this.loadingSubject.next(false);
//           return products;
//         })
//       );
//   }

//   // Filter products by limit and sort order
//   getFilteredProducts(
//     limit: number,
//     sortOrder: 'asc' | 'desc'
//   ): Observable<Product[]> {
//     const url = `${this.API_ENDPOINT}/products?limit=${limit}&sortBy=title&order=${sortOrder}`;
//     this.loadingSubject.next(true);
//     return this.http.get<ProductResponce>(url).pipe(
//       map((res) => res.products),
//       catchError((error) => {
//         this.loadingSubject.next(false);
//         throw error;
//       }),
//       map((products) => {
//         this.productsSubject.next(products);
//         this.loadingSubject.next(false);
//         return products;
//       })
//     );
//   }

//   // Get categories
//   categories(): Observable<ProductCategories[]> {
//     return this.http.get<ProductCategories[]>(
//       `${this.API_ENDPOINT}/products/categories`
//     );
//   }

//   // Create a new product
//   createProduct(product: Product) {
//     this.http.post<Product>(`${this.API_ENDPOINT}/products/add`, product, {
//       headers: { 'Content-Type': 'application/json' },
//     });
//     this.productsSubject.next([product, ...this.productsSubject.getValue()]);
//   }

//   loadMore(params: IParams): void {
//     this.loadingSubject.next(true);

//     const queryParams = new URLSearchParams();

//     if (params.limit !== undefined) queryParams.append('limit', String(params.limit));
//     if (params.skip !== undefined) queryParams.append('skip', String(params.skip));
//     if (params.sortOrder) {
//       queryParams.append('sortBy', 'title');
//       queryParams.append('order', params.sortOrder);
//     }

//     this.http
//       .get<ProductResponce>(`${this.API_ENDPOINT}/products?${queryParams.toString()}`)
//       .subscribe((res) => {
//         const currentProducts = this.productsSubject.getValue();
//         this.productsSubject.next([...currentProducts, ...res.products]);
//         this.loadingSubject.next(false);
//       });
//   }

//   // Update an existing product
//   updateProduct(id: number, updatedData: Partial<Product>) {
//     const products = this.productsSubject.getValue();
//     const nextProduct = products.find((product) => product.id === id);
//     const payload = { ...updatedData, id: undefined };
//     if (nextProduct) {
//       this.http
//         .put(`${this.API_ENDPOINT}/products/${id}`, payload, {
//           headers: { 'Content-Type': 'application/json' },
//         })
//         .subscribe({
//           next: (res) => {
//             const updatedProductFromApi: Product = {
//               ...nextProduct,
//               ...res,
//             };
//             const newProducts = products.map((product) =>
//               product.id === id ? updatedProductFromApi : product
//             );
//             this.productsSubject.next(newProducts);
//           },
//           error: (err: unknown) => {
//             console.error('Failed to update product:', err);
//           },
//         });
//     } else {
//       console.error(`Product with id: ${id} not found`);
//     }
//   }
//   deleteProductById(id: number) {
//     this.productsSubject.next(
//       this.productsSubject.getValue().filter((product) => product.id !== id)
//     );
//   }
//   getProduct(id: number | string): Observable<Product> {
//     return this.http.get<Product>(`${this.API_ENDPOINT}/products/${id}`);
//   }
// }
