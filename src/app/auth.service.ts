import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    this.cookies.set('token', token);  // Usa localStorage en ambos lados
  }
  
  getToken() {
    return this.cookies.get('token');  // También obtén el token desde localStorage
  }
  
  login(data: any): Observable<any> {
    return this.http.post("http://127.0.0.1:8000/login/", data);
  }
}
