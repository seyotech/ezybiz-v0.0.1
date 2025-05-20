import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Product } from '../../../models/product.type';
import { CommonModule } from '@angular/common';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ActionsComponent } from '../actions/actions.component';
import { CartService } from '../../../services/cart.service';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NzCardModule,
    NzImageModule,
    CommonModule,
    ActionsComponent,
    EditProductComponent
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  count: number = 0
  @Input('product') product!: Product;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((item) => {
      const cartProduct = item.filter(i => this.product.id === i.id)[0];
      this.product.count = cartProduct?.count;
    })
  }
  ngOnChanges(): void {
  }
}
