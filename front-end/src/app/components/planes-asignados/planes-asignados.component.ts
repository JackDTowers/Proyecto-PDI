import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Objetivo } from 'src/app/models/objetivo';
import { PdiService } from 'src/app/services/pdi.service';
import { ActivatedRoute } from '@angular/router';

interface ObjLink {
  id: string,
  label: string
}

@Component({
  selector: 'app-planes-asignados',
  templateUrl: './planes-asignados.component.html',
  styleUrls: ['./planes-asignados.component.css']
})
export class PlanesAsignadosComponent {
  planesAsignados : Objetivo[] = [];
  links: ObjLink[] = [];
  activeLink: ObjLink | null = null;

  constructor(private router: Router, private pdiService: PdiService, private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    const userId = this.pdiService.getUserIdLogged();
    this.pdiService.getPlanesxUsuario(userId).subscribe((planes: Objetivo[]) => {
      this.planesAsignados = planes;
      this.planesAsignados.map(objetivo => {
        this.links.push({
          id: objetivo.obj_id!.toString(),
          label: objetivo.cod_obj //'Objetivo ' + parseInt(objetivo.cod_obj.slice(2,4))
        })
      })
      if (this.links.length > 0) {
        this.activeLink = this.links[0];
        // Navega al primer link si no hay una ruta activa
        const currentUrl = this.router.url;
        if (currentUrl === '/planes-asignados') {
          this.router.navigate(['objetivo/', this.activeLink.id], { relativeTo: this.activatedRoute }); // Redirige al primer link
        }
      }
    });
  }

  onLinkClick(link: any): void {
    this.activeLink = link; // Actualiza el link activo al hacer clic
  }

}
