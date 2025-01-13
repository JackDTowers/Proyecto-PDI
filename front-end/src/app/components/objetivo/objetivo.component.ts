import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Objetivo } from 'src/app/models/objetivo';
import { PdiService } from 'src/app/services/pdi.service';
import { Router } from '@angular/router';

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
  firstUrl: string | null = null;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
    private router: Router
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id')
    this.firstUrl = this.router.url.split('/')[1];
  }

  ngOnInit(){
    // Escuchar los cambios en el parámetro `id` de la ruta
    this.aRouter.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        const parsedId = parseInt(this.id!);
        if (this.firstUrl === 'objetivo') {
          this.pdiService.getObjetivo(parsedId).subscribe((objetivo) => {
            this.objetivo = objetivo;
            const numero_obj = parseInt(objetivo.cod_obj.slice(2,4))
            this.titulo = "Objetivo Estratégico " + numero_obj;
          })
        }
        //Si es children de planes-asignados
        else {
          this.pdiService.getPlanesxObjetivo(parsedId).subscribe((objetivo) => {
            this.objetivo = objetivo;
            const numero_obj = parseInt(objetivo.cod_obj.slice(2,4))
            this.titulo = "Objetivo Estratégico " + numero_obj;
          })
        }
        this.isLoggedAdmin = this.pdiService.isAdmin();
      }
    });
  }
}
