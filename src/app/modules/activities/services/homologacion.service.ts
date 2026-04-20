import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HomologacionResponse {
  id: number;
  nombreExterno: string;
  employeeID: number;
  nombreColaboradorTMR: string;
  estado: boolean;
}

export interface CreateHomologacionRequest {
  nombreExterno: string;
  employeeID: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomologacionService {
  private http = inject(HttpClient);
  private urlBase = environment.URL_BASE;

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}/api/Homologacion`);
  }

  create(request: CreateHomologacionRequest): Observable<any> {
    return this.http.post<any>(`${this.urlBase}/api/Homologacion`, request);
  }
}
