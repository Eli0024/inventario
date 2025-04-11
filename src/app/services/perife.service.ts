import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Periferico } from '../models/perife';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PerifeService {

   private apiUrl = 'http://127.0.0.1:8000/periferico/';
  
    constructor(private http: HttpClient) { }
  
    getAll(): Observable<Periferico[]> {
      return this.http.get<Periferico[]>(this.apiUrl);
    }

    getPerifericoById(id: string): Observable<Periferico> {
          return this.http.get<Periferico>(`${this.apiUrl}${id}/`);
        }
  
    getTotalPerifericos(): Observable<number> {
      return this.http.get<number>('http://127.0.0.1:8000/perifericos/total');
    }
  
    create(periferico:Periferico):Observable<Periferico>{
      return this.http.post<Periferico>(this.apiUrl,periferico);
    }
  
    get(id:number): Observable<any> {
      return this.http.get(`${this.apiUrl}${id}/`);
    }
  
    update(periferico: Periferico): Observable<Periferico> {
      return this.http.put<Periferico>(`${this.apiUrl}${periferico.id}/`, periferico);
    }
  
    delete(id:number): Observable<Periferico> {
      return this.http.delete<Periferico>(`${this.apiUrl}${id}/`);
    }
  
  }
