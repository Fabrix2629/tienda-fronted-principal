import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOGIN_URL = 'http://localhost:8080/auth/login';
  private readonly tokenKey = 'authToken';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {}

  login(user: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(this.LOGIN_URL, { username: user, password })
      .pipe(
        tap((res) => {
          if (res.token) {
            this.setToken(res.token);
          }
        })
      );
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  private setToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['login']);
  }
}
