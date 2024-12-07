import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Objetivo } from '../models/objetivo';

@Injectable({
  providedIn: 'root'
})
export class PdiService {
  private url = 'http://localhost:4000/api'

  constructor(private http: HttpClient) { }

  getMapaEstrategico(): Observable<any[]>{
    return this.http.get<any[]>(this.url + '/mapa-estrategico');
  }

  getUsuarios(): Observable<User[]>{
    return this.http.get<User[]>(this.url + '/usuarios')
  }
  
  getObjetivos(): Observable<Objetivo[]>{
    return this.http.get<Objetivo[]>(this.url + '/objetivos')
  }
}
