import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

export interface AuthResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') {
      return 'checking';
    }

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

  // login(email: string, password: string): Observable<boolean> {
  //   return this.http
  //     .post<AuthResponse>(`${baseUrl}/auth/login`, {
  //       email: email,
  //       password: password,
  //     })
  //     .pipe(
  //       map((resp) => this.handleAuthSuccess(resp)),
  //       catchError((error: any) => this.handleAuthError(error))
  //     );
  // }

  // register(
  //   email: string,
  //   password: string,
  //   fullName: string
  // ): Observable<boolean> {
  //   return this.http
  //     .post<AuthResponse>(`${baseUrl}/auth/register`, {
  //       email: email,
  //       password: password,
  //       fullName: fullName,
  //     })
  //     .pipe(
  //       map((resp) => this.handleAuthSuccess(resp)),
  //       catchError((error: any) => this.handleAuthError(error))
  //     );
  // }

  // checkStatus(): Observable<boolean> {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     this.logout();
  //     return of(false);
  //   }

  //   return this.http
  //     .get<AuthResponse>(`${baseUrl}/auth/check-status`)
  //     .pipe(
  //       map((resp) => this.handleAuthSuccess(resp)),
  //       catchError((error: any) => this.handleAuthError(error))
  //     );
  // }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      map((resp) => {
        this._user.set(resp.user);
        this._authStatus.set('authenticated');
        this._token.set(resp.token);
        localStorage.setItem('token', token);
        return true;
      }),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  // private handleAuthSuccess({ token, user }: AuthResponse) {
  //   this._user.set(user);
  //   this._authStatus.set('authenticated');
  //   this._token.set(token);

  //   localStorage.setItem('token', token);

  //   return true;
  // }

  // private handleAuthError(error: any) {
  //   this.logout();
  //   return of(false);
  // }

  login(email: string, password: string): Observable<AuthResult> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  register(
    email: string,
    password: string,
    fullName: string
  ): Observable<AuthResult> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email,
        password,
        fullName,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  private handleAuthSuccess({ token, user }: AuthResponse): AuthResult {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    localStorage.setItem('token', token);

    return { success: true, message: 'Autenticación exitosa' };
  }

  private handleAuthError(error: any): Observable<AuthResult> {
    this.logout();

    let message = 'Ocurrió un error. Por favor, inténtalo nuevamente.';

    const apiMessage: string | undefined = error?.error?.message;

    if (apiMessage) {
      // Email duplicado
      if (
        apiMessage.includes('Key (email)') &&
        apiMessage.includes('already exists')
      ) {
        message = 'El correo electrónico ya está registrado.';
      }

      // Credenciales inválidas
      else if (
        apiMessage.includes('Credentials are not valid (email)') ||
        apiMessage.includes('Credentials are not valid (password)')
      ) {
        message = 'Correo y/o contraseña inválidos';
      }
    }

    return of({ success: false, message });
  }
}
