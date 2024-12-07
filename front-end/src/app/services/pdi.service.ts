import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PdiService {
  private url = 'http://localhost:4000/api'

  constructor(private http: HttpClient) { }

  getMapaEstrategico(): Observable<any[]>{
    return this.http.get<any[]>(this.url + '/mapa-estrategico');
  }
  
}
