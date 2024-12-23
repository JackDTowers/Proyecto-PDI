import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Objetivo } from '../models/objetivo';
import { PlanDeAccion } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class PdiService {
  private url = 'http://localhost:4000/api'

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any>{
    return this.http.post(this.url + '/login', loginData)
  }

  isLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  //Pendiente
  isAdmin(): boolean {
    return true
  }

  //Crea encabezado de petición, para autorización de usar API
  createHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')!
      })
    }
  }

  getMapaEstrategico(): Observable<any[]>{
    return this.http.get<any[]>(this.url + '/mapa-estrategico', this.createHeaders());
  }

  getUsuarios(): Observable<User[]>{
    return this.http.get<User[]>(this.url + '/usuarios')
  }

  crearUsuario(user: User): Observable<any>{
    return this.http.post(this.url + '/usuarios', user, this.createHeaders())
  }
  
  getObjetivos(): Observable<Objetivo[]>{
    return this.http.get<Objetivo[]>(this.url + '/objetivos')
  }

  getObjetivo(id: number): Observable<Objetivo>{
    return this.http.get<Objetivo>(this.url + '/objetivos/' + id)
  }

  getPlan(id: number): Observable<PlanDeAccion>{
    return this.http.get<PlanDeAccion>(this.url + '/planes/' + id)
  }

  crearPlan(planDeAccion: PlanDeAccion): Observable<any>{
    return this.http.post(this.url + '/planes', planDeAccion, this.createHeaders())
  }
}
