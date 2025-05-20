import { Component } from '@angular/core';
import { Product } from '../../../models/product.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.services';
import { NzImageModule } from 'ng-zorro-antd/image';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
      NzImageModule,
      CommonModule
    ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}
  id= 1;
  product!: Product;
  routeChange(){

    this.router.navigate(['/','products',this.id++])
  }
  ngOnInit(): void {
    // this.route.params.subscribe(res=>{
    //   console.log(res)
    // })
    // this.route.queryParams.subscribe(res=>{
    //   console.log(res)
    // })
    this.product = this.route.snapshot.data['product'];
    console.log({p: this.product})
  }

}
