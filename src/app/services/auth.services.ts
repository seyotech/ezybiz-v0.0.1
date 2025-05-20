import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/product.type';
import { BASE_URL, USER_CREDENTIALS } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private userSubject = new BehaviorSubject<User | null>(this.getUser());
  public readonly user$ = this.userSubject.asObservable();

  // Login and get token
  login(credentials: { username: string; password: string }): Observable<User> {
    // return this.httpClient.post<User>(`${BASE_URL}/auth/login`, credentials).pipe(
    //   map((user) => {
    //     this.setUser(user);
    //     return user;
    //   })
    // );
    const user: User = { ...credentials, token: 'dummytoken' };
  this.setUser(user);
  return of(user);
  }

  // Save user and token
  setUser(user: User): void {
    this.userSubject.next(user);
    this.saveUser(user);
  }

  // Logout
  logout(): void {
    this.userSubject.next(null);
    this.clearUser();
    this.router.navigate(['/sign-in']);
  }

  isLoggedIn(): Observable<boolean> {

    return this.user$.pipe(map((user) => !!user?.token));
  }

  // Helpers
  private getUser(): User | null {
    const userData = localStorage.getItem(USER_CREDENTIALS);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private saveUser(user: User): void {
    localStorage.setItem(USER_CREDENTIALS, JSON.stringify(user));
  }

  private clearUser(): void {
    localStorage.removeItem(USER_CREDENTIALS);
  }

  // Get token for interceptor
  getToken(): string | null {
    return this.userSubject.value?.token ?? null;
  }
}
