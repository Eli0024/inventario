import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Usuario } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://127.0.0.1:8000/usuarios/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  create(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.apiUrl,usuario);
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}${usuario.id_usuario}/`, usuario);
  }

  delete(id:number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.apiUrl}${id}/`);
  }

}
