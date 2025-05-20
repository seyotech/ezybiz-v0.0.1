import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.type';
import { CommonModule } from '@angular/common';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { BillingComponent } from './billing/billing.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NzButtonModule,
    NzDrawerModule,
    NzImageModule,
    NzBadgeModule,
    CommonModule,
    NzEmptyModule,
    BillingComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  visible = false;
  cartItemCount = 0;
  cartItems: Product[] = [];
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      console.log(items);
      this.cartItemCount = items.reduce(
        (total, item) => total + (item.count || 0),
        0
      );
    });
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  // removeFromCart(product: Product): void {
  //   this.cartService.removeFromCart(product);
  // }
  increaseCount(product: Product): void {
    this.cartService.addToCart(product);
  }

  decreaseCount(product: Product): void {
    if (product.count && product.count > 1) {
      this.cartService.removeFromCart(product, true); // Decrease count if more than 1
    } else {
      this.cartService.removeFromCart(product); // Remove product completely if count reaches 0
    }
  }
}
