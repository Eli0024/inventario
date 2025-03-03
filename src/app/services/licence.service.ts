import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Licence } from '../models/licence';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  private apiUrl = 'http://127.0.0.1:8000/licencias/';

  constructor(private http: HttpClient) { }

  getLicence(id: number): Observable<Licence> {
      return this.http.get<Licence>(`${this.apiUrl}${id}/`);
    }

  getLicenciaById(id: string): Observable<Licence> {
      return this.http.get<Licence>(`${this.apiUrl}${id}/`);
    }

  getAll(): Observable<Licence[]> {
    return this.http.get<Licence[]>(this.apiUrl);
  }

  getTotalLicencias(): Observable<number> {
    return this.http.get<number>('http://127.0.0.1:8000/registrarlicencia/total');
  }

  create(licence:Licence):Observable<Licence>{
    return this.http.post<Licence>(this.apiUrl,licence);
  }

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);  // Aquí se debe pasar un id válido
  }
  
  update(licence: Licence): Observable<Licence> {
    return this.http.put<Licence>(`${this.apiUrl}${licence.id_licencia}/`, licence);
  }

  delete(id: number): Observable<Licence> {
    return this.http.delete<Licence>(`${this.apiUrl}${id}/`);
  }

}
