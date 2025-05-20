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
  totalPrice$ = this.cartItemsSubject.asObservable().pipe(
    map((items) =>
      items.reduce(
        (total, item) => total + ((item?.price ?? 0) * (item.count ?? 1)),
        0
      )
    )
  );

//   addToCart(product: Product): void {
//     this.cartItems.push(product);
//     this.cartItemsSubject.next(this.cartItems);
//   }
  addToCart(product: Product): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.count! += 1;  // Increment count if product exists
    } else {
      this.cartItems.push({...product, count: 1});  // Add new product with count 1
    }
    this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items
  }
  getCartItemCount(): number {
    return this.cartItems.length;
  }
//   removeFromCart(product: Product): void {
//     this.cartItems = this.cartItems.filter(item => item.id !== product.id);
//     this.cartItemsSubject.next(this.cartItems); 
//   }
removeFromCart(product: Product, decreaseOnly: boolean = true): void {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      if (decreaseOnly && existingProduct.count! > 1) {
        existingProduct.count! -= 1;  // Decrease the count
      } else {
        // If count is 1 or if we want to remove entirely
        this.cartItems = this.cartItems.filter(item => item.id !== product.id);  // Remove the product
      }
      this.cartItemsSubject.next(this.cartItems);  // Emit updated cart items
    }
  }
  getCountById(id: number){
    console.log(this.cartItems.filter(item=> item.id).filter(i=>i.count), this.cartItems.forEach(item=> item.id === id));
    
    return this.cartItems.forEach(item=> item.id === id)
  }
}
