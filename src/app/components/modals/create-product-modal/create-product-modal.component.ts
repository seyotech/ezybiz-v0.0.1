import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { Product } from '../../../models/product.type';
import { AuthService } from '../../../services/auth.services';
import { ProductService } from '../../../services/product.services';
@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [
    NzFormModule,
    CommonModule,
    NzInputModule,
    NzModalModule,
    NzButtonModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzTimePickerModule,
  ],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.css',
})
export class CreateProductModalComponent implements OnInit, OnDestroy {
  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}

  userSubscription?: Subscription;
  permission = false;
  isLoading = false;
  user = false;
  ngOnInit(): void {
    this.userSubscription = this.authService
      .isLoggedIn()
      .subscribe((isLoggedIn) => (this.user = isLoggedIn));
  }

  showModal(): void {
    if (this.user) {
      this.permission = true;
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  handleCancel(): void {
    this.permission = false;
  }

  productForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', {
      validators: [Validators.required],
    }),
    thumbnail: new FormControl('', { validators: [Validators.required] }),
  });

  onSubmit() {
    if (this.productForm.invalid) return;
    const newProduct: Product = {
      id: Math.floor(Math.random() * 100),
      title: this.productForm.value.title || '',
      description: this.productForm.value.description || '',
      thumbnail: this.productForm.value.thumbnail || '',
    };
    this.isLoading = true;
    this.productService.createProduct(newProduct);
    this.productForm.reset();
    this.isLoading = false;
    this.permission = false;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
