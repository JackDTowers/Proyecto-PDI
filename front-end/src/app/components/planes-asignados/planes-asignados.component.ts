import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';

@Component({
  selector: 'app-planes-asignados',
  templateUrl: './planes-asignados.component.html',
  styleUrls: ['./planes-asignados.component.css']
})
export class PlanesAsignadosComponent {
  links = [
    { id: '1', label: 'Objetivo 1' },
    { id: '2', label: 'Objetivo 2' },
  ];
  activeLink = this.links[0];

  constructor(private router: Router) {}

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
