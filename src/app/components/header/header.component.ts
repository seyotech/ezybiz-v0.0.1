import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CartComponent } from '../cart/cart.component';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.services';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzMenuModule,
    CommonModule,
    NzLayoutModule,
    CartComponent,
    RouterModule,
    NzIconModule,
    NzDropDownModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isCollapsed = false;
  cartItemCount = 0;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}
  user = this.authService.isLoggedIn();
  

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItemCount = items.length;
    });

    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
