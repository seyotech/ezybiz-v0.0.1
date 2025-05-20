import { Component, inject, OnInit } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ProductService } from '../../../services/product.services';
import { Product, ProductCategories, Products } from '../../../models/product.type';
import { CommonModule } from '@angular/common';
import { CategoryStateService } from '../../../services/category-state.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NzMenuModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  constructor(private productSerivice: ProductService, private categoryState: CategoryStateService) { }
  // productService: ProductService = inject(ProductService);
  productCategories: ProductCategories[] = [];
  selectedCategory: string = 'all'; 

  ngOnInit() {
    this.getAllCategories();
    this.categoryState.selectedCategory$.subscribe((category) => {
      this.selectedCategory = category || 'all'; // set 'all' if null or undefined
    });
  }
  private getAllCategories() {
    this.productSerivice.categories()
      .subscribe((categories) => {
        this.productCategories = categories;
      });
  }
  
  onSelectCategory(category: string) {
    this.categoryState.selectCategory(category);
  }





}
