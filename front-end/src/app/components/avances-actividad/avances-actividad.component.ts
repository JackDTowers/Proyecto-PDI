import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { Actividad } from 'src/app/models/actividad';
import { Avance } from 'src/app/models/avance';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  displayedColumns : string[] = ['Nombre', 'Resumen', 'Fecha de Creación', 'Acciones'];
  avances : Avance[] | undefined;
  isCompleted = false;
  formActividad: FormGroup;
  editingStat = false;
  fetching = false;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder
  ){
    this.formActividad = this.formBuilder.group({
      estado: ['', Validators.required]
    })
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

  editStat(){
    this.editingStat = true;
    this.formActividad.setValue({estado: this.actividad?.estado});
  }

  saveStat(){
    this.fetching = true;
    this.formActividad.disable();
    this.formActividad.updateValueAndValidity();
    this.pdiService.editarEstadoActividad( parseInt(this.id!), this.formActividad.value.estado).subscribe(() => {
      this.pdiService.getAvances(this.id!).subscribe((actividad) => {
        this.actividad = actividad;
        this.editingStat = false;
        this.fetching = false;
        this.formActividad.enable();
      })
    })
  }
  
  cancelStat(){
    this.editingStat = false;
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
