import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  authorities?: string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly LOGIN_URL = 'http://localhost:8080/auth/login';
  private readonly tokenKey = 'authToken';
  private readonly REFRESH_URL = 'http://localhost:8080/auth/refresh';
  private readonly tokenSubject = new BehaviorSubject<string | null>(
    this.getToken()
  );
  private storage: Storage | null = null;

  public token$ = this.tokenSubject.asObservable();

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      this.storage = localStorage;
    } catch (e) {
      this.storage = null;
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<{ token: string }>(this.LOGIN_URL, { username, password })
      .pipe(
        tap(({ token }) => this.setToken(token)),
        map(() => true)
      );
  }

  private setToken(token: string): void {
    if (this.storage) {
      this.storage.setItem(this.tokenKey, token);
    }
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    if (!this.storage) return null;
    return this.storage.getItem(this.tokenKey);
  }

  getCurrentUser(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      return !!exp && Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  refreshToken(): Observable<string | null> {
    const token = this.getToken();
    if (!token) return of(null);

    return this.httpClient
      .post<{ token: string }>(this.REFRESH_URL, { token })
      .pipe(
        tap(({ token: newToken }) => this.setToken(newToken)),
        map(({ token }) => token),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  logout(): void {
    if (this.storage) {
      this.storage.removeItem(this.tokenKey);
    }
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  getCurrentUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user?.authorities || [];
  }

  hasRole(role: string): boolean {
    const roles = this.getCurrentUserRoles();
    return roles.includes(role);
  }
}
