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
      archivo: [''],
    })
    this.idActividad = this.aRouter.snapshot.paramMap.get('id');
  }

  //Para la subida de archivos
  getFile($event: any){
    //De momento solo un archivo aunque el evento tiene una lista de archivos por lo que se puede más de 1
    const [ file ] = $event.target.files;
  }

  ingresar(){
    this.avanceForm.disable() //Para que no pueda volver apretar el botón
    this.avanceForm.updateValueAndValidity();

    const REPORTEAVANCE: Avance = {
      nombre: this.avanceForm.get('nombre')?.value,
      descripcion: this.avanceForm.get('descripcion')?.value,
      archivo: this.avanceForm.get('archivo')?.value,
    };

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
