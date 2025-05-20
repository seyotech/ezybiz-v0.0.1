import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Component, OnInit } from '@angular/core';

// local imports
import { ProductCategories } from '../../../models/product.type';
import { ProductService } from '../../../services/product.services';
import { CategoryStateService } from '../../../services/category-state.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NzMenuModule, CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private categoryState: CategoryStateService
  ) {}
  productCategories: ProductCategories[] = [];
  selectedCategory: string = 'all';

  ngOnInit() {
    this.getAllCategories();
    this.categoryState.selectedCategory$.subscribe((category) => {
      this.selectedCategory = category || 'all'; // set 'all' if null or undefined
    });
  }
  private getAllCategories() {
    this.productService.categories().subscribe((categories) => {
      this.productCategories = categories;
    });
  }

  onSelectCategory(category: string) {
    this.categoryState.selectCategory(category);
  }
}
