import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, Role } from '../models/auth.models';

const TOKEN_KEY = 'hiresmart_token';
const USER_KEY = 'hiresmart_user';

export interface UserSession {
  id: number;
  email: string;
  role: Role;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserSession | null>(this.getStoredUser());
  public currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/auth/reset-password', { token, newPassword });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>('/api/auth/change-password', { currentPassword, newPassword });
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.userSubject.getValue();
  }

  getUserRole(): Role | null {
    const user = this.userSubject.getValue();
    return user ? user.role : null;
  }

  isRecruiter(): boolean {
    return this.getUserRole() === 'RECRUITER';
  }

  isCandidate(): boolean {
    return this.getUserRole() === 'CANDIDATE';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  getCurrentUser(): UserSession | null {
    return this.userSubject.getValue();
  }

  private handleAuthSuccess(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.token);
    const session: UserSession = {
      id: response.id,
      email: response.email,
      role: response.role,
      displayName: response.displayName
    };
    localStorage.setItem(USER_KEY, JSON.stringify(session));
    this.userSubject.next(session);
  }

  private getStoredUser(): UserSession | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
