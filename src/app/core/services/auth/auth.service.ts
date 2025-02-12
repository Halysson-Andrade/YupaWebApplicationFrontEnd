import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private readonly API_URL = `${environment.apiURL}`;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  get authStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  isAuthenticated(): boolean {
    const token =
      this.cookieService.get('auth_token') ||
      sessionStorage.getItem('auth_token');
    if (token) {
      this.decodeToken(token);
    }
    this.loggedIn.next(!!token);
    return !!token;
  }

  isChangePasswordRequired(): boolean {
    const token =
      this.cookieService.get('auth_token') ||
      sessionStorage.getItem('auth_token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.usr_changepassword || false;
    }
    return false;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
    const url = `${this.API_URL}/login`;

    return this.http.post<any>(url, body, { headers }).pipe(
      tap((response) => {
        if (response.data && response.data.token) {
          const token = response.data.token;

          sessionStorage.setItem('auth_token', token);

          if (rememberMe) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);

            this.cookieService.set('email', email, {
              expires: expires,
              secure: true,
              sameSite: 'Strict',
            });

            this.cookieService.set('password', password, {
              expires: expires,
              secure: true,
              sameSite: 'Strict',
            });
          } else {
            this.cookieService.delete('email');
            this.cookieService.delete('password');
          }

          this.decodeToken(token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  changePassword(
    userId: number,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      UserId: userId.toString(),
    });

    const body = {
      usr_id: userId,
      email: email,
      oldPassword: oldPassword,
      password: newPassword,
      passwordCheck: confirmPassword,
    };

    return this.http.patch<any>(`${this.API_URL}/changepassword`, body, {
      headers,
    });
  }

  sendForgotPasswordRequest(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      email: email,
    };

    return this.http.patch<any>(`${this.API_URL}/forgot`, body, {
      headers,
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.cookieService.delete('auth_token');
    this.cookieService.delete('email');
    this.cookieService.delete('password');
    this.loggedIn.next(false);
  }

  private decodeToken(token: string): any {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      const expiry = decodedToken.exp * 1000;
      if (Date.now() > expiry) {
        this.logout();
        return null;
      }

      for (const key in decodedToken) {
        if (decodedToken.hasOwnProperty(key)) {
          sessionStorage.setItem(key, JSON.stringify(decodedToken[key]));
        }
      }

      return decodedToken;
    } catch (error) {
      console.error('Token inválido:', error);
    }
  }

  getEmailFromCookie(): string {
    return this.cookieService.get('email') || '';
  }

  getPasswordFromCookie(): string {
    return this.cookieService.get('password') || '';
  }
}
