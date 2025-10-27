import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { Colaborador } from '../models/users';


@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private apiUrl = 'http://127.0.0.1:8000/colaborador/';
  private apiUrl1 = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Error en UsersService:', error);
    let msg = 'Ocurrió un error inesperado';
    if (error.status === 401) msg = 'No autorizado';
    if (error.status === 404) msg = 'Recurso no encontrado';
    if (error.error?.detail) msg = error.error.detail;
    return throwError(() => new Error(msg));
  }

  generarReporteUsuariosPorArea(area: string) {
    return this.http.get(`${this.apiUrl1}/api/generar-reporte/`, { 
      params: { area }, 
      responseType: 'blob',
    }).pipe(catchError(this.handleError));
  }


  getAll(): Observable<Colaborador[]> {
    const empresa = localStorage.getItem('empresa') || '';
    const params = { empresa }; // enviamos empresa manualmente
    return this.http.get<Colaborador[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getAllGlobal(): Observable<Colaborador[]> {
  return this.http.get<Colaborador[]>(`${this.apiUrl}all/`)
    .pipe(catchError(this.handleError));
 }

  getColaboradorById(id: string): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.apiUrl}${id}/`);
  }
  
  getTotalColaboradores(): Observable<number> {
  return this.http.get<{ total: number }>('http://127.0.0.1:8000/registrarcolaborador/total/').pipe(
    map(res => res.total)
  );
}

  create(colaborador: Colaborador): Observable<Colaborador> {
    // Enviar empresa manualmente
    const payload = {
      ...colaborador,
      empresa_id: colaborador.empresa_id
    };
    return this.http.post<Colaborador>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }

  get(id: number): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

  update(colaborador: Colaborador): Observable<Colaborador> {
    const payload = {
      ...colaborador,
      empresa_id: colaborador.empresa_id
    };
    return this.http.patch<Colaborador>(`${this.apiUrl}${colaborador.id}/`, payload)
      .pipe(catchError(this.handleError));
  }

  // Eliminar colaborador
  delete(id: number): Observable<Colaborador> {
    return this.http.delete<Colaborador>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }

}
