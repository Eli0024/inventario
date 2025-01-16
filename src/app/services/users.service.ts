import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Colaborador } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://127.0.0.1:8000/colaborador/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.apiUrl);
  }

  getTotalColaboradores(): Observable<number> {
    return this.http.get<number>('http://127.0.0.1:8000/registrarcolaborador/total');
  }

  create(colaborador:Colaborador):Observable<Colaborador>{
    return this.http.post<Colaborador>(this.apiUrl,colaborador);
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(colaborador: Colaborador): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.apiUrl}${colaborador.id_colaborador}/`, colaborador);
  }

  delete(id:number): Observable<Colaborador> {
    return this.http.delete<Colaborador>(`${this.apiUrl}${id}/`);
  }

}
