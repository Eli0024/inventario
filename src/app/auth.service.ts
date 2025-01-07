import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class Authservice {

  private apiUrl = 'http://127.0.0.1:8000/register/';

  constructor(private http: HttpClient, private cookies: CookieService ) {}


  register(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);  // Enviar los datos como JSON
  }

  // Guardar el token en el localStorage o sessionStorage
  setToken(token: string) {
    localStorage.setItem('token', token);  // Usa localStorage en ambos lados
  }
  
  getToken() {
    return localStorage.getItem('token');  // También obtén el token desde localStorage
  }
  
  getauthoken():boolean{
    return !!this.cookies.get("token")
  }
  getUserProfile(): Observable<any> {
    return this.http.get("http://127.0.0.1:8000/profile/")
  }
  lista_usuarios(){
    return this.http.get<any>("http://127.0.0.1:8000/lista/usuarios/") 
  }
  actualizar_usuarios(id: number, form: any):Observable<any>{
    return this.http.put(`http://127.0.0.1:8000/modificarusuario/${id}/`,form)
  }
  

  isAdmin(): Observable<boolean>{
    return this.getUserProfile().pipe(
      map(user => user.is_staff),
    )
  }
  is_taff(){
    return localStorage.getItem('is_staff') === 'true'; 
  }
  login(user: any): Observable<any> {
    return this.http.post("http://127.0.0.1:8000/login/", user);
  }
  
  profile(){
    const headers = new HttpHeaders().set('Authorization', `Token ${this.getToken()}`);
    return this.http.get("http://127.0.0.1:8000/profile/", {headers});
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('is_staff');
  }
  loogouttoken():void{
    this.cookies.delete('token')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }


  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  isStaff(): boolean {
    return localStorage.getItem('is_staff') === 'true';
  }

  private setIsStaff(isStaff: boolean): void {
    localStorage.setItem('is_staff', String(isStaff));
  }

  getCurrentUserId(): Observable<number | undefined> {
    const token = localStorage.getItem('authToken');
    if (token) {
      return this.http.get<any>(`${this.apiUrl}/users/me/`).pipe(
        map(user => user.id),
        catchError(() => of(undefined))
      );
    }
    return of(undefined);
  }
  registerMedidas(medidas: { temperatura: number, humedad: number }):Observable<any>{
    return this.http.post("http://127.0.0.1:8000/mediciones/", medidas);
  }
}
