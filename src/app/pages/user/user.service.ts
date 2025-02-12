import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiURL}/users`;

  constructor(private http: HttpClient) {}

  private createHeaders(userId: string): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      UserId: userId,
    });
  }

  getUsers(userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.get<any>(this.API_URL, { headers });
  }

  createUser(user: any, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.post<any>(this.API_URL, user, { headers });
  }

  updateUser(user: any, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.put<any>(this.API_URL, user, { headers });
  }

  deleteUser(teste: number, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    const url = `${this.API_URL}/${teste}`;
    return this.http.delete<any>(url, { headers });
  }
}
