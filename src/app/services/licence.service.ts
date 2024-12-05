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

  getAll(): Observable<Licence[]> {
    return this.http.get<Licence[]>(this.apiUrl);
  }

  create(licence:Licence):Observable<Licence>{
    return this.http.post<Licence>(this.apiUrl,licence);
  }

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);  // Aquí se debe pasar un id válido
  }
  
  update(licence: Licence): Observable<Licence> {
    return this.http.put<Licence>(`${this.apiUrl}${licence.id}/`, licence);
  }

  delete(id: number): Observable<Licence> {
    return this.http.delete<Licence>(`${this.apiUrl}${id}/`);
  }

}
