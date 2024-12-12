import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  private apiUrl = 'http://localhost:8000/api';  // Cambia esta URL según sea necesario

  constructor(private http: HttpClient) {}

  getNodos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nodos/`);
  }

  getSwitches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/switches/`);
  }

  getConexiones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/conexiones/`);
  }
}