import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputersService {

  private apiUrl = 'http://127.0.0.1:8000/encargados/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Encargado[]> {
    return this.http.get<Encargado[]>(this.apiUrl);
  }

  create(encargado:Encargado):Observable<Encargado>{
    return this.http.post<Encargado>(this.apiUrl,encargado);
  }

  get(id:number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  update(encargado: Encargado): Observable<Encargado> {
    return this.http.put<Encargado>(`${this.apiUrl}${encargado.id_encargado}/`, encargado);
  }

  delete(id:number): Observable<Encargado> {
    return this.http.delete<Encargado>(`${this.apiUrl}${id}`);
  }

}
