import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {
  titulo = 'Crear Cuenta de Usuario';
  id: string | null;
  userForm : FormGroup
  matcher = new MyErrorStateMatcher();

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService,
    private toastr: ToastrService,
  ) {
    this.userForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      //contrasena: ['', Validators.required],
      cargo: ['', Validators.required],
      admin: [0],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id')
  }

  ngOnInit(): void{
    this.esEditar();
  }

  ingresar(){
    //Faltan aún más validaciones a este nivel y a nivel back

    this.userForm.disable() //Para que no pueda volver apretar el botón
    this.userForm.updateValueAndValidity();

    const admin = this.userForm.get('admin')?.value
    var is_admin = 0
    if (admin){
      is_admin = 1
    }

    const USER: User = {
      correo: this.userForm.get('correo')?.value,
      contrasena: '12345',
      nombre: this.userForm.get('nombre')?.value,
      cargo: this.userForm.get('cargo')?.value,
      isAdmin: is_admin
    };

    this.pdiService.crearUsuario(USER).subscribe(
      (response) => {
        // Manejar la respuesta del middleware, por ejemplo, mostrar una confirmación al usuario.
        //console.log('Usuario creado con éxito:', response);
        this.toastr.success('Datos ingresados correctamente', 'Usuario Registrado!');
        this.router.navigate(['/gestion-usuarios']);
      },
      (error) => {
        // Manejar errores, como mostrar un mensaje de error al usuario.
        //console.error('Error al crear el usuario:', error);
        this.toastr.error('Ha ocurrido un error', 'Usuario No Registrado');
        this.router.navigate(['/gestion-usuarios']);
      }
    );
  }

  esEditar(){
    if (this.id != null){
      this.titulo = "Editar Datos de Usuario"
    }
  }
}
