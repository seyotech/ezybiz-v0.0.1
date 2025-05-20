import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

// local imports
import { IParams, Product } from '../../../models/product.type';
import { ProductComponent } from '../product/product.component';
import { ProductService } from '../../../services/product.services';
import { TopbarComponent } from '../../topbar/topbar/topbar.component';
import { CategoryStateService } from '../../../services/category-state.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    TopbarComponent,
    ProductComponent,
    NzPaginationModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  search: string = '';
  products: Product[] = [];
  limit = 5;
  skip = 0;
  sortOrder: 'asc' | 'desc' = 'asc';
  totalProducts = 0;
  currentPage = 1;
  private destroy$ = new Subject<void>(); // To clean up subscriptions

  products$ = this.productService.products$;
  loading$ = this.productService.isLoading$;

  constructor(
    private productService: ProductService,
    private categoryState: CategoryStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productService.total$.subscribe((total) => {
      this.totalProducts = total;
    });
    this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search') || '';
      this.sortOrder = (params.get('order') as 'asc' | 'desc') || 'asc';
      this.limit = Number(params.get('limit')) || 5;
      this.skip = Number(params.get('skip')) || 0;

      if (this.search) {
        this.productService
          .searchProducts(this.buildParams({ query: this.search }))
          .subscribe((products) => (this.products = products));
      } else {
        this.fetchBySelectedCategory();
      }
    });

    this.fetchBySelectedCategory();
  }

  // Handle load more logic with category or search-based conditions
  loadMore() {
    this.skip += this.limit;

    if (this.search) {
      this.productService
        .searchProducts(this.buildParams({ query: this.search }))
        .subscribe();
    } else {
      this.productService.getProducts(this.buildParams());
    }
  }

  // Build query params for fetching products
  private buildParams(extraParams?: Partial<IParams>) {
    return {
      limit: this.limit,
      skip: this.skip,
      sortOrder: this.sortOrder,
      ...extraParams,
    };
  }

  // Fetch products based on selected category
  private fetchBySelectedCategory() {
    this.categoryState.selectedCategory$
      .pipe(takeUntil(this.destroy$)) // Ensure we unsubscribe when the component is destroyed
      .subscribe((category) => {
        if (category === 'all') {
          this.productService.getProducts(this.buildParams());
        } else {
          this.getProductsByCategory(category);
        }
      });
  }

  private getProductsByCategory(category: string) {
    this.productService
      .getProductsByCategory(category)
      .subscribe((products) => (this.products = products));
  }
  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.limit);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.skip = (page - 1) * this.limit;

    if (this.search) {
      this.productService
        .searchProducts({
          query: this.search,
          ...this.buildParams(),
        })
        .subscribe();
    } else {
      this.productService.getProducts(this.buildParams());
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../../services/product.services';
// import { Product } from '../../../models/product.type';
// import { ActivatedRoute } from '@angular/router';
// import { CategoryStateService } from '../../../services/category-state.service';
// import { AsyncPipe, CommonModule } from '@angular/common';
// import { TopbarComponent } from '../../topbar/topbar/topbar.component';
// import { ProductComponent } from '../product/product.component';

// @Component({
//   selector: 'app-products',
//   standalone: true,
//   imports: [CommonModule, TopbarComponent, ProductComponent, AsyncPipe],
//   templateUrl: './products.component.html',
//   styleUrls: ['./products.component.css'],
// })
// export class ProductsComponent implements OnInit {
//   search: string = '';
//   products: Product[] = [];
//   limit = 5;
//   skip = 0;
//   sortOrder: 'asc' | 'desc' = 'asc';
//   // sortOrder:string = 'asc' | 'desc'

//   // loading: boolean = false;

//   products$ = this.productService.products$;
//   loading$ = this.productService.isLoading$;

//   constructor(
//     private productService: ProductService,
//     private categoryState: CategoryStateService,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit() {
//     this.route.queryParamMap.subscribe((params) => {
//       this.search = params.get('search') || '';
//       this.sortOrder = (params.get('order') as 'asc' | 'desc') || 'asc';
//       this.limit = parseInt(params.get('limit') || '5', 10);
//       this.skip = parseInt(params.get('skip') || '0', 10);
//       if (this.search) {
//         this.productService
//           .searchProducts({ query: this.search, ...this.getFilterParams() })
//           .subscribe((products) => (this.products = products));
//       } else {
//         this.categoryState.selectedCategory$.subscribe((category) => {
//           if (category === 'all') {
//             this.productService.getProducts(this.getFilterParams());
//           } else {
//             this.getProductsByCategory(category);
//           }
//         });
//       }
//     });

//     // this.productService.isLoading$.subscribe((loading) => {
//     //   this.loading = loading;
//     // });
//   }
//   loadMore() {
//     this.skip += this.limit;
//     this.productService.loadMore(this.getFilterParams());
//   }

//   private getFilterParams() {
//     return {
//       limit: this.limit,
//       skip: this.skip,
//       sortOrder: this.sortOrder,
//     };
//   }

//   private getProductsByCategory(category: string) {
//     this.productService
//       .getProductsByCategory(category)
//       .subscribe((products) => (this.products = products));
//   }
// }
