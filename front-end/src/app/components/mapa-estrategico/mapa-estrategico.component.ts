import { Component } from '@angular/core';
import { Eje } from 'src/app/models/eje';
import { PdiService } from 'src/app/services/pdi.service';

@Component({
  selector: 'app-mapa-estrategico',
  templateUrl: './mapa-estrategico.component.html',
  styleUrls: ['./mapa-estrategico.component.css']
})
export class MapaEstrategicoComponent {
  title = 'Mapa Estratégico Plan de Desarrollo Institucional'
  mapa: Eje[] = []
  thereIsNoMap = true;
  lbMapa = 'No existen datos para el mapa estrategico'

  constructor(private pdiService: PdiService){}

  ngAfterViewInit(): void {
    this.pdiService.getMapaEstrategico().subscribe((mapa: Eje[]) => {
      this.mapa = mapa;
      if (this.mapa.length > 0){
        this.thereIsNoMap = false;
      }
    });
  }


}
