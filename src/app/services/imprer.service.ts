import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Impresora } from '../models/imprer';

@Injectable({
  providedIn: 'root'
})
export class ImprerService {

  private apiUrl = 'http://127.0.0.1:8000/impresora/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Impresora[]> {
    return this.http.get<Impresora[]>(this.apiUrl);
  }

  getTotalLicencias(): Observable<number> {
    return this.http.get<number>('http://127.0.0.1:8000/registrarlicencia/total');
  }

  create(impresora:Impresora):Observable<Impresora>{
    return this.http.post<Impresora>(this.apiUrl,impresora);
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(impresora: Impresora): Observable<Impresora> {
    return this.http.put<Impresora>(`${this.apiUrl}${impresora.id_impre}/`, impresora);
  }

  delete(id:number): Observable<Impresora> {
    return this.http.delete<Impresora>(`${this.apiUrl}${id}/`);
  }

}