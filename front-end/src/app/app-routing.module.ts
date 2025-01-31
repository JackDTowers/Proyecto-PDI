import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { MapaEstrategicoComponent } from './components/mapa-estrategico/mapa-estrategico.component';
import { CrearPlanComponent } from './components/crear-plan/crear-plan.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';
import { PlanAccionComponent } from './components/plan-accion/plan-accion.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { loginGuard } from './guards/login.guard';
import { CrearAvanceComponent } from './components/crear-avance/crear-avance.component';
import { VerAvanceComponent } from './components/ver-avance/ver-avance.component';
import { AvancesActividadComponent } from './components/avances-actividad/avances-actividad.component';
import { adminGuard } from './guards/admin.guard';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { PlanesAsignadosComponent } from './components/planes-asignados/planes-asignados.component';

const routes: Routes = [
  { path: 'login', component: IniciarSesionComponent },
  { path: 'mapa-estrategico', component: MapaEstrategicoComponent, canActivate: [loginGuard] },
  { path: 'objetivo/:id', component: ObjetivoComponent, canActivate: [loginGuard] },
  { path: 'plan/:id', component: PlanAccionComponent, canActivate: [loginGuard] },
  { path: 'crear-plan', component: CrearPlanComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'crear-plan/:id', component: CrearPlanComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'editar-plan/:id', component: CrearPlanComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'gestion-usuarios', component: ListaUsuariosComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'crear-usuario', component: CrearUsuarioComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'editar-usuario/:id', component: CrearUsuarioComponent, canActivate: [loginGuard, adminGuard] },
  { path: 'actividad/:id', component: AvancesActividadComponent, canActivate: [loginGuard] },
  { path: 'crear-avance/:id', component: CrearAvanceComponent, canActivate: [loginGuard] },
  { path: 'editar-avance/:id', component: CrearAvanceComponent, canActivate: [loginGuard] },
  { path: 'ver-avance/:id', component: VerAvanceComponent, canActivate: [loginGuard] },
  { path: 'planes-asignados', component: PlanesAsignadosComponent, canActivate: [loginGuard], 
    children: [ {path : 'objetivo/:id', component: ObjetivoComponent, canActivate: [loginGuard] } ]
  },
  { path: '', component: IniciarSesionComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/mapa-estrategico', pathMatch: 'full' },
];

const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload', // Permitir recargar componentes en la misma URL
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
