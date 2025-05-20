import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    NzMenuModule,
    CommonModule,
    NzSelectModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  constructor(private router: Router) {}
  selectedLimit = 5;
  selectedSortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit() {}
  onLimitChange(value: number) {
    this.selectedLimit = value;
    if (this.selectedLimit) {
      this.router.navigate([], {
        queryParams: { limit: this.selectedLimit },
        queryParamsHandling: 'merge',
      });
    }
  }

  onSortOrderChange(value: 'asc' | 'desc') {
    this.selectedSortOrder = value;
    if (this.selectedLimit) {
      this.router.navigate([], {
        queryParams: { order: this.selectedSortOrder },
        queryParamsHandling: 'merge',
      });
    }
  }
}
