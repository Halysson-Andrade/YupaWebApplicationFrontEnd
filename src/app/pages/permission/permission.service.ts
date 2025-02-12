import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly API_URL = `${environment.apiURL}/permissions`;

  constructor(private http: HttpClient) {}

  private createHeaders(userId: string): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      UserId: userId,
    });
  }

  getPermissions(userId: string): Observable<any> {
    const headers = this.createHeaders(userId);
    return this.http.get<any>(this.API_URL, { headers });
  }

  createPermission(permission: any, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.post<any>(this.API_URL, permission, { headers });
  }

  updatePermission(permission: any, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    return this.http.put<any>(this.API_URL, permission, { headers });
  }

  deletePermission(permissionId: number, userId: string): Observable<any> {
    const headers = this.createHeaders(userId);

    const url = `${this.API_URL}/${permissionId}`;
    return this.http.delete<any>(url, { headers });
  }
}
