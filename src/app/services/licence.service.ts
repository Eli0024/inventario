import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Licence } from '../models/licence';
import { Authservice } from '../auth.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import {map,catchError} from 'rxjs/operators'

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
  return this.http.get<{ total: number }>('http://127.0.0.1:8000/registrarlicencia/total/').pipe(
    map(res => res.total)
  );
  }

  getByEquipo(equipoId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}equipo/${equipoId}/`);
 }


  create(licence: Licence): Observable<any> {
      
      const datosEnvio:any= {
        tipo_licencia: licence.tipo_licencia,
        correo: licence.correo && licence.correo.trim() !== '' ? licence.correo : null,
        contrasena: licence.contrasena && licence.contrasena.trim() !== '' ? licence.contrasena : null,
        clave_producto: licence.clave_producto,
        fecha_compra: licence.fecha_compra||null,
      };

    if ( licence.equipo_id) {
        datosEnvio.equipo_id = licence.equipo_id;
      }
    
      return this.http.post(this.apiUrl, datosEnvio);
  }
  
    

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(licence: any): Observable<any> {
    const datosActualizacion: any = {};

    const camposLicencia = [
      'id',
      'tipo_licencia',
      'correo',
      'contrasena',
      'clave_producto',
      'fecha_compra',
      'fecha_expiracion',
      
    ];

    camposLicencia.forEach(campo => {
      if (licence[campo] !== undefined) {
        datosActualizacion[campo] = licence[campo] === '' ? null : licence[campo];
      }
    });
    if (licence.equipo_id) {
      datosActualizacion.equipo_id = licence.equipo_id;
    }

    return this.http.put(`${this.apiUrl}${licence.id}/`, datosActualizacion);
  }

  delete(id: number): Observable<Licence> {
    return this.http.delete<Licence>(`${this.apiUrl}${id}/`);
  }
}

