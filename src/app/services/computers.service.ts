import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Equipo } from '../models/computer';

@Injectable({
  providedIn: 'root'
})
export class ComputersService {

  private apiUrl = 'http://127.0.0.1:8000/registrarequipo/';
  

  constructor(private http: HttpClient) { }

  
  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  getEquipo(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}${id}/`);
  }

  checkSerial(serial: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/equipos/serial/${serial}`);
  }

  // equipo.service.ts
getTotalEquipos(): Observable<number> {
  return this.http.get<number>('http://127.0.0.1:8000/registrarequipo/total');
}


  create(equipo: Equipo): Observable<Equipo> {
    const formData = new FormData();
  
    // Verificación de archivo
    if (equipo.archivo instanceof File) {
      let archivo = equipo.archivo;
      if (archivo.name.length > 100) {
        archivo = new File([archivo], archivo.name.substring(0, 100), { type: archivo.type });
      }
      formData.append('archivo', archivo);
    } else {
      console.error('El archivo no es válido');
    }
  
    // Agregar otros campos
    formData.append('marca', equipo.marca);
    formData.append('memoria', equipo.memoria);
    formData.append('procesador', equipo.procesador);
    formData.append('office', equipo.office);
    formData.append('serial', equipo.serial);
    formData.append('windows', equipo.windows);
    formData.append('sistema_operativo', equipo.sistema_operativo);
    formData.append('fecha_adquisicion', equipo.fecha_adquisicion);
    formData.append('estado', equipo.estado);
  
    // Agregar responsable (Asegurarse de enviar el ID como cadena)
    console.log('responsable ID:', equipo.responsable);  // Debug: Ver qué contiene responsable
    if (equipo.responsable != null) {
      formData.append('responsable', equipo.responsable.toString());  // Asegurarse de que se envíe como cadena
    } else {
      console.error('El campo "responsable" es obligatorio y debe contener un ID válido');
      alert('El campo "responsable" es obligatorio y debe contener un ID válido.');
      return throwError(() => new Error('El campo "responsable" es obligatorio y debe contener un ID válido.'));
    }
  
    // Enviar solicitud
    return this.http.post<Equipo>(this.apiUrl, formData).pipe(
      catchError(error => {
        console.error('Error de solicitud:', error);
        alert('Ocurrió un error al enviar los datos. Revisa los campos e intenta de nuevo.');
        if (error.status === 400) {
          console.error('Detalles del error 400:', error.error);
        }
        return throwError(() => new Error(error));
      })
    );
  }
      

  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(equipo: Equipo): Observable<Equipo> {
    const formData = new FormData();
    // Verificación de archivo (si lo estás enviando)
    if (equipo.archivo instanceof File) {
      let archivo = equipo.archivo;
      if (archivo.name.length > 100) {
        archivo = new File([archivo], archivo.name.substring(0, 100), { type: archivo.type });
      }
      formData.append('archivo', archivo);
    }
  
    // Agregar otros campos
    formData.append('marca', equipo.marca);
    formData.append('memoria', equipo.memoria);
    formData.append('procesador', equipo.procesador);
    formData.append('office', equipo.office);
    formData.append('serial', equipo.serial);
    formData.append('windows', equipo.windows);
    formData.append('sistema_operativo', equipo.sistema_operativo);
    formData.append('fecha_adquisicion', equipo.fecha_adquisicion);
    formData.append('estado', equipo.estado);
  
    // Agregar responsable (Asegurarse de enviar el ID como cadena)
    if (equipo.responsable != null) {
      formData.append('responsable', equipo.responsable.toString());
    } else {
      console.error('El campo "responsable" es obligatorio y debe contener un ID válido');
      alert('El campo "responsable" es obligatorio y debe contener un ID válido.');
      return throwError(() => new Error('El campo "responsable" es obligatorio y debe contener un ID válido.'));
    }
  
    // Enviar la solicitud de actualización (PUT)
    return this.http.put<Equipo>(`${this.apiUrl}${equipo.id_equipo}/`, formData).pipe(
      catchError(error => {
        console.error('Error de solicitud:', error);
        alert('Ocurrió un error al enviar los datos. Revisa los campos e intenta de nuevo.');
        if (error.status === 400) {
          console.error('Detalles del error 400:', error.error);
        }
        return throwError(() => new Error(error));
      })
    );
  }
  
    

  delete(id: number): Observable<Equipo> {
    return this.http.delete<Equipo>(`${this.apiUrl}${id}/`); // Agregar barra al final
  }
}
