import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class Authservice {
  
  private loginUrl = "http://127.0.0.1:8000/login/";
  private apiUrl = "http://127.0.0.1:8000";  // URL base para otras solicitudes
  
  constructor(private http: HttpClient, private cookies: CookieService ) {}

  getCsrfToken() {
    return this.cookies.get('csrftoken');
  }

  // Método para registro de usuario
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, user);
  }

  // Establecer el token en las cookies
  setToken(token: string): void {
    this.cookies.set('token', token, { expires: 7, path: '/' });  // Guardar el token en las cookies por 7 días
  }
  
  // Obtener el token almacenado en las cookies
  getToken(): string {
    return this.cookies.get("token");
  }

  // Método de login
  // auth.service.ts (Angular)

  login(user: { username: string; password: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.loginUrl, user, { headers }).pipe(
      tap(response => {
        // Guardar el token en las cookies
        this.setToken(response.token); // Guarda el token en las cookies
        // Opcional: guardar información adicional en localStorage si es necesario
        localStorage.setItem('is_staff', response.user.is_staff);
      })
    );
  }
  

  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.getToken();  // Verifica si el token está presente en las cookies
  }

  // Método para obtener perfil de usuario autenticado
  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.getToken()}`);
    return this.http.get(`${this.apiUrl}/profile/`, { headers });
  }

  // Método para obtener la lista de usuarios (restringido)
  lista_usuarios(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Token ${this.getToken()}`);
    return this.http.get<any>(`${this.apiUrl}/lista/usuarios/`, { headers });
  }

  logout() {
    this.cookies.delete('sessionid'); // Elimina la cookie de sesión
    this.cookies.delete('csrftoken'); // Elimina la cookie CSRF si es necesario
    // Redirige al usuario a la página de login
  }
  
  
  // Método para verificar si el usuario es staff (admin)
  isStaff(): boolean {
    const isStaff = localStorage.getItem('is_staff');
    return isStaff === 'true';  // Retorna true si es staff
  }

  // Método para limpiar el token en localStorage (si lo usas en algún momento)
  clearToken(): void {
    this.cookies.delete('token'); // Limpiar el token
  }

}
