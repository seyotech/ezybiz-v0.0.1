import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ReactiveFormsModule } from '@angular/forms';
import { TopbarComponent } from '../topbar/topbar/topbar.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ProductsComponent } from "../products/products/products.component";
import { CategoriesComponent } from '../products/categories/categories.component';
import { HeaderComponent } from '../header/header.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { ProductDetailsComponent } from '../products/product-details/product-details.component';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterOutlet,
        NzIconModule,
        NzMenuModule,
        CommonModule,
        NzLayoutModule,
        NzBreadCrumbModule,
        ReactiveFormsModule,
        CategoriesComponent,
        HeaderComponent,
        NzIconModule,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    user = false
    isCollapsed = false;
}

// export class WelcomeComponent implements OnInit {

//     constructor() { }
  
//     ngOnInit() { }
  
//   }
