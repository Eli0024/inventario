import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

private apiUrl = 'http://localhost:8000/recursos/';

  constructor(private http: HttpClient) {}

  getRecursos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}