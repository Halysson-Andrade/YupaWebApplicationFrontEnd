import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly API_URL = `${environment.apiURL}/menus`;

  constructor(private http: HttpClient) {}

  private createHeaders(userId: string): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      UserId: userId,
    });
  }

  getMenus(userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.get<any>(this.API_URL, { headers });
  }

  createMenu(menu: any, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.post<any>(this.API_URL, menu, { headers });
  }

  updateMenu(menu: any, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.put<any>(this.API_URL, menu, { headers });
  }

  deleteMenu(menuId: number, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    const url = `${this.API_URL}/${menuId}`;
    return this.http.delete<any>(url, { headers });
  }
}
