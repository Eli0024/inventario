import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiBaseUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient
  ) { }

  getEmpresas(): Observable<any> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/empresas/`);
  }

  seleccionarEmpresa(empresaId: number) {
    localStorage.setItem('empresa_id', empresaId.toString());
  }

  // empresa actualmente seleccionada
  getEmpresaActual(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/empresa-actual/`);
  }

  // Cambiar la empresa activa
  cambiarEmpresa(empresaId: number): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/cambiar-empresa/`, { empresa_id: empresaId });
  }

  // 4. Obtener los datos visuales de la empresa activa (nombre, logo, color)
  getDatosEmpresa(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/datos-empresa/`);
  }
}

