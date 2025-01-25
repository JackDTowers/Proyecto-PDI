import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { Actividad } from 'src/app/models/actividad';
import { Avance } from 'src/app/models/avance';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';

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
  isCompleted = false;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.pdiService.getAvances(this.id!).subscribe((actividad) => {
      this.actividad = actividad;
      this.avances = actividad.avances;
      this.isOwner = this.pdiService.isOwner(this.actividad?.plan?.user_id!);
      if (actividad.estado == '100' || actividad.estado?.toLowerCase() == 'completo'
      || actividad.estado?.toLowerCase() == 'completado' || actividad.estado?.toLowerCase() == 'listo'){
        this.isCompleted = true;
      }
    })
    this.isLoggedAdmin = this.pdiService.isAdmin();
  }

  eliminarAvance(id: number, nombre: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        tittle: 'Eliminar Reporte de Avance', 
        content: '¿Estás seguro de eliminar el reporte de avance con nombre ' + nombre + 
        '? Se eliminarán todos los archivos asociados. Esta acción es irreversible.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.pdiService.eliminarAvance(id).subscribe((response) => {
          this.toastr.success('Reporte de Avance eliminado con éxito', 'Avance Eliminado');
          // Navegar a la misma ruta para reiniciar el componente
          this.router.navigateByUrl('/act', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/actividad/' + this.id]);
          });
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error al intentar eliminar el avance', 'Avance no eliminado');
        });
      }
    });
  }
}
