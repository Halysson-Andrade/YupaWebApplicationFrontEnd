import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCompanieResponse, ApiResponse } from '../../../shared/interfaces/companie.interfaces'; // Supondo que essas interfaces já existam

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  // Método para buscar dados da empresa
  getCompany(cmp_id: string, environment: string, headers: HttpHeaders): Observable<ApiCompanieResponse> {
    const params = new HttpParams().set('cmp_id', cmp_id || ''); // Se cmp_id for indefinido, seta uma string vazia
    return this.http.get<ApiCompanieResponse>(`${environment}/companies/read`, { headers, params });
  }

  // Método para buscar automações
  getAutomations(environment: string, headers: HttpHeaders): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment}/automations`, { headers });
  }
}