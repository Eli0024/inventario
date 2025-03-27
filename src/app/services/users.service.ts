import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Colaborador } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://127.0.0.1:8000/colaborador/';
  private apiUrl1 = 'http://127.0.0.1:8000'; // Asegúrate de que sea la misma URL base

  constructor(private http: HttpClient) { }

  generarReporteUsuariosPorArea(area: string) {
    return this.http.get(`${this.apiUrl1}/api/generar-reporte/`, { 
      params: { area }, // Pasar el área como parámetro
      responseType: 'blob', // Indicar que la respuesta es un archivo binario
    });
  }

  getAll(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.apiUrl);
  }

  getColaboradorById(id: string): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.apiUrl}${id}/`);
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
    return this.http.put<Colaborador>(`${this.apiUrl}${colaborador.id}/`, colaborador);
  }

  delete(id:number): Observable<Colaborador> {
    return this.http.delete<Colaborador>(`${this.apiUrl}${id}/`);
  }

}
