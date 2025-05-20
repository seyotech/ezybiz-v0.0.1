import { Component } from '@angular/core';
import { CreateProductModalComponent } from '../../modals/create-product-modal/create-product-modal.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CreateProductModalComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

}
