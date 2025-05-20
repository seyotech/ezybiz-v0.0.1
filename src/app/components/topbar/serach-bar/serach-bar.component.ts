import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NzInputModule, NzButtonModule, FormsModule],
  templateUrl: './serach-bar.component.html',
  styleUrl: './serach-bar.component.css'
})
export class SerachBarComponent {
  searchText = '';
  constructor(private router: Router){}
  
  // @Output() search = new EventEmitter<string>();

  onSearch(): void {
    if (this.searchText.trim()) {
      this.router.navigate([], {
        queryParams: { search: this.searchText },
        queryParamsHandling: 'merge',
      });
    }
  }
}
