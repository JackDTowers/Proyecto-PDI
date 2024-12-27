import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { Actividad } from 'src/app/models/actividad';
import { Avance } from 'src/app/models/avance';

@Component({
  selector: 'app-avances-actividad',
  templateUrl: './avances-actividad.component.html',
  styleUrls: ['./avances-actividad.component.css']
})
export class AvancesActividadComponent {
  isLoggedAdmin = false;
  isOwner = false;
  id: string | null;
  actividad: Actividad | null = null;
  displayedColumns : string[] = ['Nombre', 'Fecha de Creación', 'Acciones'];
  avances : Avance[] | undefined;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.pdiService.getAvances(this.id!).subscribe((actividad) => {
      this.actividad = actividad;
      this.avances = actividad.avances;
      this.isOwner = this.pdiService.isOwner(this.actividad?.plan?.user_id!);
    })
  }
}
