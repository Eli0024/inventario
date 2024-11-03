import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Equipo } from '../models/computer';

@Injectable({
  providedIn: 'root'
})
export class ComputersService {

  private apiUrl = 'http://127.0.0.1:8000/registrarequipo/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  create(equipo:Equipo):Observable<Equipo>{
    return this.http.post<Equipo>(this.apiUrl,equipo);
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(equipo: Equipo): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.apiUrl}${equipo.id_equipo}/`, equipo);
  }

  delete(id:number): Observable<Equipo> {
    return this.http.delete<Equipo>(`${this.apiUrl}${id}`);
  }

}
