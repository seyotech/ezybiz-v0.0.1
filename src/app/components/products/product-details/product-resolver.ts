import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ProductService } from '../../../services/product.services';
import { Product } from '../../../models/product.type';


@Injectable({
  providedIn: 'root'
})
export class ProductResolverService implements Resolve<Product> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Product | Observable<Product> | Promise<Product> {


   const id = route.params['id'];

   
  return this.productService.getProduct(id);

  }

  constructor(private productService:ProductService) { }
}
