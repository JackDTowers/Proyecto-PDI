import { Component } from '@angular/core';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { ToastrService } from 'ngx-toastr';
import { Avance } from 'src/app/models/avance';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Archivo } from 'src/app/models/avance';

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
  editing : boolean = false;
  idAvance: string | null = null;
  avance : Avance | null = null;
  archivosEliminados : number[] = [];
  archivos: Archivo[] = [];

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.avanceForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
    })
    this.idActividad = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(){
    this.esEditar();
  }

  //Para la subida de archivos
  getFile($event: any){
    const input = $event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }

  eliminarArchivo(id: number, index: number){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        tittle: 'Eliminar Archivo', 
        content: '¿Estás seguro de eliminar el archivo? Esta acción será irreversible.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.archivosEliminados.push(id);
        if (this.archivos.length > 0){
          this.archivos.splice(index, 1);
        }
      }
    });
  }

  ingresar(){
    this.avanceForm.disable() //Para que no pueda volver apretar el botón
    this.avanceForm.updateValueAndValidity();
    
    const REPORTEAVANCE = new FormData();
    const MAXFILES = 10;  // Máximo de archivos a subir

    REPORTEAVANCE.append('nombre', this.avanceForm.get('nombre')?.value);
    REPORTEAVANCE.append('descripcion', this.avanceForm.get('descripcion')?.value);
    console.log(this.files)
    if (this.files.length > 0) {
      if (this.files.length > MAXFILES) {
        this.toastr.error('Solo se pueden subir hasta ' + MAXFILES + ' archivos', 'Error');
        this.avanceForm.enable();
        this.avanceForm.updateValueAndValidity();
        return;
      }
      //Validar tamaño
      const tamañoSuperado = this.files.find((file)=>file.size > 50*1024*1024);
      if (tamañoSuperado){
        this.toastr.error('Existe un archivo que supera los 50 MB de tamaño, intente subir archivos de nuevo', 'Error');
        this.avanceForm.enable();
        this.avanceForm.updateValueAndValidity();
        return
      }
      this.files.forEach((file) => {
        REPORTEAVANCE.append('archivos', file); // Agregar el archivo
      });
    }
    if (!this.editing){
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
    else {
      REPORTEAVANCE.append('archivosEliminados', JSON.stringify(this.archivosEliminados));
      this.pdiService.editarAvance(parseInt(this.idAvance!), REPORTEAVANCE).subscribe(
        (response) => {
          this.toastr.success('Datos ingresados correctamente', 'Reporte de Avance Actualizado!');
          this.router.navigate(['/ver-avance/' + this.idAvance]);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Avance No Actualizado');
          this.avanceForm.enable();
          this.avanceForm.updateValueAndValidity();
        }
      )
    }
  }

  esEditar(){
    if (this.aRouter.snapshot.routeConfig?.path?.split('/')[0] == 'editar-avance'){
      this.editing = true;
      this.titulo = 'Editar Avance';
      this.idAvance = this.aRouter.snapshot.paramMap.get('id');
      this.pdiService.getAvance(this.idAvance!).subscribe((avance) => {
        this.avance = avance;
        this.archivos = avance.archivos!;
        if (!avance){
          this.router.navigate(['/mapa-estrategico']);
          return;
        }
        this.avanceForm.setValue({
          nombre: avance.nombre,
          descripcion: avance.descripcion
        })
      })
    }
  }
}
