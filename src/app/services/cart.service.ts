import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../models/product.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Product[] = [];
  private cartItemsSubject = new BehaviorSubject<Product[]>(this.cartItems);

  cartItems$ = this.cartItemsSubject.asObservable();
  totalPrice$ = this.cartItemsSubject
    .asObservable()
    .pipe(
      map((items) =>
        items.reduce(
          (total, item) => total + (item?.price ?? 0) * (item.count ?? 1),
          0
        )
      )
    );

  addToCart(product: Product): void {
    const existingProduct = this.cartItems.find(
      (item) => item.id === product.id
    );
    if (existingProduct) {
      existingProduct.count! += 1;
    } else {
      this.cartItems.push({ ...product, count: 1 });
    }
    this.cartItemsSubject.next(this.cartItems);
  }
  getCartItemCount(): number {
    return this.cartItems.length;
  }
  removeFromCart(product: Product, decreaseOnly: boolean = true): void {
    const existingProduct = this.cartItems.find(
      (item) => item.id === product.id
    );
    if (existingProduct) {
      if (decreaseOnly && existingProduct.count! > 1) {
        existingProduct.count! -= 1;
      } else {
        this.cartItems = this.cartItems.filter(
          (item) => item.id !== product.id
        );
      }
      this.cartItemsSubject.next(this.cartItems);
    }
  }
  getCountById(id: number) {
    return this.cartItems.forEach((item) => item.id === id);
  }
  //   addToCart(product: Product): void {
  //     this.cartItems.push(product);
  //     this.cartItemsSubject.next(this.cartItems);
  //   }
  //   removeFromCart(product: Product): void {
  //     this.cartItems = this.cartItems.filter(item => item.id !== product.id);
  //     this.cartItemsSubject.next(this.cartItems);
  //   }
}
