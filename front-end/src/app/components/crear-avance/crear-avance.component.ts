import { Component } from '@angular/core';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { ToastrService } from 'ngx-toastr';
import { Avance } from 'src/app/models/avance';

@Component({
  selector: 'app-crear-avance',
  templateUrl: './crear-avance.component.html',
  styleUrls: ['./crear-avance.component.css']
})
export class CrearAvanceComponent {
  titulo = 'Crear Avance';
  idActividad: string | null;
  avanceForm : FormGroup;
  matcher = new MyErrorStateMatcher();
  files : File[] = [];

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService,
    private toastr: ToastrService,
  ) {
    this.avanceForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
    })
    this.idActividad = this.aRouter.snapshot.paramMap.get('id');
  }

  //Para la subida de archivos
  getFile($event: any){
    const input = $event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }

  ingresar(){
    this.avanceForm.disable() //Para que no pueda volver apretar el botón
    this.avanceForm.updateValueAndValidity();
    
    const REPORTEAVANCE = new FormData();
    const MAXFILES = 10;  // Máximo de archivos a subir

    REPORTEAVANCE.append('nombre', this.avanceForm.get('nombre')?.value);
    REPORTEAVANCE.append('descripcion', this.avanceForm.get('descripcion')?.value);
    if (this.files.length > 0) {
      if (this.files.length > MAXFILES) {
        this.toastr.error('Solo se pueden subir hasta ' + MAXFILES + ' archivos', 'Error');
        return;
      }
      this.files.forEach((file) => {
        REPORTEAVANCE.append('archivos', file); // Agregar el archivo
      });
    }

    this.pdiService.crearAvance(this.idActividad!, REPORTEAVANCE).subscribe(
      (response) => {
        // Manejar la respuesta del middleware, por ejemplo, mostrar una confirmación al usuario.
        //console.log('Avance creado con éxito:', response);
        this.toastr.success('Datos ingresados correctamente', 'Reporte de Avance Registrado!');
        this.router.navigate(['/actividad/' + this.idActividad]);
      },
      (error) => {
        // Manejar errores, como mostrar un mensaje de error al usuario.
        //console.error('Error al crear el avance:', error);
        this.toastr.error('Ha ocurrido un error', 'Avance No Registrado');
        this.router.navigate(['/actividad/' + this.idActividad]);
      }
    );
  }
}
