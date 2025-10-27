import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContrasenaEquipo } from '../models/equipo';
import { Authservice } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EquipoPasswordService {

  private apiUrl = 'http://127.0.0.1:8000/contrasena-equipo/';

  constructor(private http: HttpClient) {}


  private handleError(error: any) {
    if (error.status === 401) {
      return throwError(() => new Error('No estás autorizado. Inicia sesión.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('Recurso no encontrado.'));
    } else {
      return throwError(() => new Error('Error del servidor. Intenta más tarde.'));
    }
  }

  getAll(): Observable<ContrasenaEquipo[]> {
    return this.http.get<ContrasenaEquipo[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  get(id: number): Observable<ContrasenaEquipo> {
    return this.http.get<ContrasenaEquipo>(`${this.apiUrl}${id}/`)
     .pipe(catchError(this.handleError));
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}total/`)
      .pipe(catchError(this.handleError));
  }

  create(formData: FormData): Observable<ContrasenaEquipo> {
  return this.http.post<ContrasenaEquipo>(this.apiUrl, formData)
    .pipe(catchError(this.handleError));
 }


  update(id: number, data: any): Observable<ContrasenaEquipo> {
    const formData = new FormData();

    if (data.usuario) formData.append('usuario', data.usuario);
    if (data.contrasena) formData.append('contrasena', data.contrasena);

    if (data.responsable?.id) {
      formData.append('responsable_id', String(data.responsable.id));
    } else {
      throw new Error('ID del responsable es obligatorio');
    }

    if (data.correo){
      formData.append('correo',data.correo);
    }

    if (data.archivo instanceof File) {
      formData.append('archivo', data.archivo);
    }

    return this.http.put<ContrasenaEquipo>(`${this.apiUrl}${id}/`, formData)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}${id}/`)
      .pipe(catchError(this.handleError));
  }
}
