import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private http: HttpClient) {}

  loadColors(url: string): Observable<any> {
    return this.http.get(url);
  }

  applyColors(colors: any): void {
    Object.keys(colors).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, colors[key]);
    });
  }
}
