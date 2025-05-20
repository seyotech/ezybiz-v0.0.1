import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CategoryStateService {
  private selectedCategorySubject = new BehaviorSubject<string>('all');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  selectCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }
}