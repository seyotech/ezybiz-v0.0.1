import { Component, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router, RouterModule } from '@angular/router';

// local imports 
import { Product } from '../../../models/product.type';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.services';
import { ProductService } from '../../../services/product.services';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'product-actions',
  standalone: true,
  imports: [NzButtonModule, RouterModule, EditProductComponent],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.css',
})
export class ActionsComponent {
  @Input('product') product!: Product;
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}
  isLoggedIn$ = this.authService.isLoggedIn();

  private handleLoginCheck(action: () => void): void {
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        action();
      } else {
        this.router.navigate(['/sign-in']);
      }
    });
  }

  addToCart(product: Product): void {
    this.handleLoginCheck(() => {
      this.cartService.addToCart(product);
    });
  }

  deleteProduct(id: number): void {
    this.handleLoginCheck(() => {
      this.productService.deleteProductById(id);
    });
  }
}
