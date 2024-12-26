import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Objetivo } from '../models/objetivo';
import { PlanDeAccion } from '../models/plan';
import { Avance } from '../models/avance';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Actividad } from '../models/actividad';

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

  //Decodificar jsonwebtoken (no verifica firma, pero las rutas de igual manera están protegidas en API)
  private decodeJWT(token: any) {
    const payload = token.split('.')[1]; // Obtener la segunda parte (payload)
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))); // Decodificar base64url y convertir a JSON
  }

  isAdmin(): boolean {
    const decodedToken = this.decodeJWT(localStorage.getItem('token'));
    if (decodedToken.is_admin == 1){
      return true;
    }
    return false;
  }

  //Para ver si es responsable del plan
  isOwner(id: number): boolean{
    const decodedToken = this.decodeJWT(localStorage.getItem('token'));
    if (decodedToken.id_cuenta == id){
      return true;
    }
    return false;
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

  crearAvance(actividadId: string, reporteAvance: Avance): Observable<any>{
    return this.http.post(this.url + '/avances/' + actividadId, reporteAvance)
  }

  getAvances(id: string): Observable<Actividad>{
    return this.http.get<Actividad>(this.url + '/actividades/' + id);
  }
}
