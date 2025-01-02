import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Objetivo } from 'src/app/models/objetivo';
import { PdiService } from 'src/app/services/pdi.service';

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.css']
})
export class ObjetivoComponent {
  titulo = "Objetivo Estratégico ";
  isLoggedAdmin = false;
  id: string | null;
  objetivo: Objetivo | null = null;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id')
  }

  ngOnInit(){
    // Escuchar los cambios en el parámetro `id` de la ruta
    this.aRouter.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        const parsedId = parseInt(this.id!);
        this.pdiService.getObjetivo(parsedId).subscribe((objetivo) => {
          this.objetivo = objetivo;
          const numero_obj = parseInt(objetivo.cod_obj.slice(2,4))
          this.titulo = "Objetivo Estratégico " + numero_obj;
        })
        this.isLoggedAdmin = this.pdiService.isAdmin();
      }
    });
  }
}
