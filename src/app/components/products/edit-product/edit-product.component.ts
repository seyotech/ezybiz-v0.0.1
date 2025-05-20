import { Router } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  Input,
  OnInit,
  OnChanges,
  Component,
  SimpleChanges,
} from '@angular/core';
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
  selector: 'app-edit-product',
  standalone: true,
  imports: [NzModalModule, NzInputModule, NzButtonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit, OnChanges {
  @Input({ required: true }) product!: Product;
  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  isLoggedIn$ = this.authService.isLoggedIn();

  isVisible = false;
  isConfirmLoading = false;

  form = new FormGroup({
    title: new FormControl('', { validators: [Validators.required] }),
    description: new FormControl('', {
      validators: [Validators.required],
    }),
    thumbnail: new FormControl('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.setFormValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    this.form.patchValue({
      title: this.product.title,
      description: this.product.description,
      thumbnail: this.product.thumbnail,
    });
  }

  showModal(): void {
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.isVisible = true;
      } else {
        this.router.navigate(['/sign-in']);
      }
    });
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 500);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onSubmit() {
    const updatedProduct: Partial<Product> = {
      title: this.form.value.title || '',
      description: this.form.value.description || '',
      thumbnail: this.form.value.thumbnail || '',
    };
    this.productService.updateProduct(this.product.id, updatedProduct);

    this.form.reset();
  }
}
