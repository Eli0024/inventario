import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mantenimiento } from '../models/manten';

@Injectable({
  providedIn: 'root'
})
export class MantenService {

  private apiUrl = 'http://127.0.0.1:8000/mantenimiento/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  getTotalMantenimientos(): Observable<number> {
    return this.http.get<number>('http://127.0.0.1:8000/mantenimiento/total');
  }

  create(mantenimiento:Mantenimiento):Observable<Mantenimiento>{
    return this.http.post<Mantenimiento>(this.apiUrl,mantenimiento);
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(mantenimiento: Mantenimiento): Observable<Mantenimiento> {
    return this.http.put<Mantenimiento>(`${this.apiUrl}${mantenimiento.id}/`, mantenimiento);
  }

  delete(id:number): Observable<Mantenimiento> {
    return this.http.delete<Mantenimiento>(`${this.apiUrl}${id}/`);
  }

}
