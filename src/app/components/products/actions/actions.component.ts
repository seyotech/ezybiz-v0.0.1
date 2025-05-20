import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../models/product.type';
import { ProductService } from '../../../services/product.services';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { AuthService } from '../../../services/auth.services';

@Component({
  selector: 'product-actions',
  standalone: true,
  imports: [NzButtonModule, RouterModule, EditProductComponent],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.css'
})
export class ActionsComponent {
  @Input('product') product!: Product;
  constructor(private cartService: CartService, private productService: ProductService, private router: Router, private authService: AuthService) { }
  isLoggedIn$ = this.authService.isLoggedIn();
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  deleteProduct(id: number) {
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.productService.deleteProductById(id);
      } else {
        this.router.navigate(['/sign-in']);
      }
    });
  };
}
