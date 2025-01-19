import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Objetivo } from '../models/objetivo';
import { PlanDeAccion } from '../models/plan';
import { Avance } from '../models/avance';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Actividad } from '../models/actividad';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PdiService {
  private url = 'http://localhost:4000/api'

  constructor(private http: HttpClient, private router: Router, private toastService: ToastrService) { }

  //Auth Services
  login(loginData: any): Observable<any>{
    return this.http.post(this.url + '/login', loginData)
  }

  logout(): void{
    if (localStorage.getItem('token')) {
      // Elimina la cookie llamada 'token'
      localStorage.removeItem('token');
      this.toastService.info('Se ha cerrado sesión')
      this.router.navigate(['/login'])
    }
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

  getUserIdLogged(): number {
    const decodedToken = this.decodeJWT(localStorage.getItem('token'));
    const userId = decodedToken.id_cuenta;
    return parseInt(userId);
  }

  getUserNameLogged(): string {
    const decodedToken = this.decodeJWT(localStorage.getItem('token'));
    const userName = decodedToken.nombre;
    return userName;
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

  //PDI Services
  getMapaEstrategico(): Observable<any[]>{
    return this.http.get<any[]>(this.url + '/mapa-estrategico', this.createHeaders());
  }

  getUsuarios(): Observable<User[]>{
    return this.http.get<User[]>(this.url + '/usuarios', this.createHeaders())
  }

  crearUsuario(user: User): Observable<any>{
    return this.http.post(this.url + '/usuarios', user, this.createHeaders())
  }

  eliminarUsuario(id: number): Observable<any>{
    return this.http.delete(this.url + '/usuarios/' + id, this.createHeaders())
  }
  
  getObjetivos(): Observable<Objetivo[]>{
    return this.http.get<Objetivo[]>(this.url + '/objetivos')
  }

  getObjetivo(id: number): Observable<Objetivo>{
    return this.http.get<Objetivo>(this.url + '/objetivos/' + id)
  }

  //Obtiene el objetivo solo con los planes del usuario logeado
  getPlanesxObjetivo(id: number): Observable<Objetivo>{
    return this.http.get<Objetivo>(this.url + '/objetivos/usuario/' + id, this.createHeaders())
  }

  //Obtiene los objetivos correspondientes al usuario logueado, contiene aquellos objetivos que tienen planes asignados a él
  getPlanesxUsuario(userId: number): Observable<Objetivo[]>{
    return this.http.get<Objetivo[]>(this.url + '/planes/usuario/' + userId, this.createHeaders())
  }

  getPlan(id: number): Observable<PlanDeAccion>{
    return this.http.get<PlanDeAccion>(this.url + '/planes/' + id)
  }

  crearPlan(planDeAccion: PlanDeAccion): Observable<any>{
    return this.http.post(this.url + '/planes', planDeAccion, this.createHeaders())
  }

  editarObservaciones(id: number, observaciones: string): Observable<any>{
    return this.http.patch(this.url + '/planes/' + id, {observaciones}, this.createHeaders())
  }

  eliminarPlan(id: number): Observable<any>{
    return this.http.delete(this.url + '/planes' + id)
  }

  crearAvance(actividadId: string, reporteAvance: FormData): Observable<any>{
    return this.http.post(this.url + '/avances/' + actividadId, reporteAvance, this.createHeaders())
  }

  getAvances(id: string): Observable<Actividad>{
    return this.http.get<Actividad>(this.url + '/actividades/' + id);
  }

  getAvance(id: string): Observable<Avance>{
    return this.http.get<Avance>(this.url + '/avances/' + id);
  }

  getFIle(id: number): Observable<any>{
    return this.http.get(this.url + '/avances/file/' + id, {responseType: 'blob'});
  }

  editarAvance(id: number, avance: FormData): Observable<any>{
    return this.http.patch(this.url + '/avances/' + id, avance, this.createHeaders())
  }

  eliminarAvance(id: number): Observable<any>{
    return this.http.delete(this.url + '/avances/' + id, this.createHeaders());
  }
}
