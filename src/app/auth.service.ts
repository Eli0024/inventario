import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class Authservice {
  private apiUrl = "http://127.0.0.1:8000"; 
  
  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router
  ) {}

  getEmpresaId(): number | null {
    const id = localStorage.getItem('empresa_id');
    return id ?  Number(id) : null;
  }

  setEmpresaId(id:number): void {
    localStorage.setItem('empresa_id', id.toString());
  }

  clearEmpresaId(): void {
    localStorage.removeItem('empresa_id');
  }
 
  login(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, user).pipe(
      tap((response: any) => {
        this.handleAuthResponse(response);
      }),
      catchError(this.handleError)
    );
  }


  seleccionarEmpresa(empresa_id: number):void{
    localStorage.setItem('empresa_id',empresa_id.toString());
  }

  
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, user).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleAuthResponse(response: any): void {
    if (response.token) {
      this.setToken(response.token);
      
      // Guardar información adicional del usuario si está disponible
      if (response.user) {
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
    }
  }

 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = error.error?.detail || error.error?.message || error.statusText;
    }
    return throwError(() => new Error(errorMessage));
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Métodos para gestión del token
  setToken(token: string): void {
    localStorage.setItem('token',token);
  }

  // Verificación de autenticación mejorada
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Aquí podrías añadir validación JWT si usas ese formato
    return true;
  }

  // Logout completo
  logout(): void {
    // Eliminar todas las cookies relacionadas con la autenticación
    this.cookies.delete('token', '/');
    this.cookies.delete('sessionid', '/');
    this.cookies.delete('csrftoken', '/');
    
    // Limpiar localStorage
    localStorage.removeItem('user_data');
    localStorage.removeItem('empresa_id');
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  
  getCsrfToken(): string {
    return this.cookies.get('csrftoken');
  }

  isStaff(): boolean {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      return user.is_staff === true;
    }
    return false;
  }


  // Método para obtener perfil de usuario
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/`). pipe(
      catchError(this.handleError)
    );
  }
}
