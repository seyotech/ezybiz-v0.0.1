import { Component, EventEmitter, Output } from '@angular/core';
import { SerachBarComponent } from '../serach-bar/serach-bar.component';
import { FilterComponent } from '../filter/filter.component';
import { AddProductComponent } from "../add-product/add-product.component";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [SerachBarComponent, FilterComponent, AddProductComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
}
