import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaEstrategicoComponent } from './components/mapa-estrategico/mapa-estrategico.component';
import { CrearPlanComponent } from './components/crear-plan/crear-plan.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';

const routes: Routes = [
  { path: 'mapa-estrategico', component: MapaEstrategicoComponent },
  { path: 'crear-plan', component: CrearPlanComponent },
  { path: 'editar-plan/:id', component: CrearPlanComponent },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
  { path: '', component: MapaEstrategicoComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
