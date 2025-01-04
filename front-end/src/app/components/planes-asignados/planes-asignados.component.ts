import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Objetivo } from 'src/app/models/objetivo';
import { PdiService } from 'src/app/services/pdi.service';

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
  activeLink = this.links[0];

  constructor(private router: Router, pdiService: PdiService) {
    const userId = pdiService.getUserIdLogged();
    pdiService.getPlanesxUsuario(userId).subscribe((planes: Objetivo[]) => {
      this.planesAsignados = planes;
      this.planesAsignados.map(objetivo => {
        this.links.push({
          id: objetivo.obj_id!.toString(),
          label: 'Objetivo ' + parseInt(objetivo.cod_obj.slice(2,4))
        })
      })
    });
  }

  ngOnInit(): void {
    // Navega al primer link si no hay una ruta activa
    const currentUrl = this.router.url;
    if (currentUrl === 'planes-asignados' || currentUrl === 'planes-asignados/') {
      this.router.navigate(['objetivo/', this.activeLink.id]); // Redirige al primer link
    }
  }

  onLinkClick(link: any): void {
    this.activeLink = link; // Actualiza el link activo al hacer clic
  }

}
