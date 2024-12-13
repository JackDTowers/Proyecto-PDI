import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaEstrategicoComponent } from './components/mapa-estrategico/mapa-estrategico.component';
import { CrearPlanComponent } from './components/crear-plan/crear-plan.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { FormIndicadorPlanComponent } from './components/form-indicador-plan/form-indicador-plan.component';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';
import { PlanAccionComponent } from './components/plan-accion/plan-accion.component';

const routes: Routes = [
  { path: 'mapa-estrategico', component: MapaEstrategicoComponent },
  { path: 'objetivo/:id', component: ObjetivoComponent },
  { path: 'plan/:id', component: PlanAccionComponent },
  { path: 'crear-plan', component: CrearPlanComponent },
  { path: 'crear-plan/:id', component: CrearPlanComponent },
  { path: 'editar-plan/:id', component: CrearPlanComponent },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
  { path: 'indicador', component: FormIndicadorPlanComponent },
  { path: '', component: MapaEstrategicoComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
