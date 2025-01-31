import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import Validation from '../../utils/validation';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface TypeForm {
  typeForm: string;
  iconView: string;
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
  types: TypeForm[] = [];
  contraLabel = 'Contraseña';
  isEditar = false;
  userData:  | null = null;

  constructor( 
    private formBuilder: FormBuilder,
    private aRouter: ActivatedRoute,
    private router: Router,
    private pdiService: PdiService,
    private toastr: ToastrService,
  ) {
    this.userForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        verify_correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(8)]],
        verify_pass: ['', [Validators.required, Validators.minLength(8)]],
        cargo: ['', Validators.required],
        admin: [0],
      },
      {
        validators: [Validation.match('correo', 'verify_correo'), Validation.match('contrasena', 'verify_pass')]
      }
    );
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.types = [{typeForm: 'password', iconView: 'visibility_off'}, {typeForm: 'password', iconView: 'visibility_off'}]
  }

  ngOnInit(): void{
    this.esEditar();
  }

  changeType(index: number): void{
    if(this.types[index].typeForm == 'password'){
      this.types[index].typeForm = 'text';
      this.types[index].iconView = 'visibility';
    }
    else{
      this.types[index].typeForm = 'password';
      this.types[index].iconView = 'visibility_off';
    }
  }

  ingresar(){
    this.userForm.disable() //Para que no pueda volver apretar el botón
    this.userForm.updateValueAndValidity();

    const admin = this.userForm.get('admin')?.value
    var is_admin = 0
    if (admin){
      is_admin = 1
    }

    if (!this.isEditar){
      const USER: User = {
        correo: this.userForm.get('correo')?.value,
        contrasena: this.userForm.get('contrasena')?.value,
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
          if (error.status == 400){
            this.toastr.error('El correo ya está registrado', 'Usuario No Registrado');
            this.router.navigate(['/gestion-usuarios']);
          }
          else{
            this.toastr.error('Ha ocurrido un error', 'Usuario No Registrado');
            this.router.navigate(['/gestion-usuarios']);
          }
        }
      );
    }
    else {
      const USER: any = {
        contrasena: this.userForm.get('contrasena')?.value,
        nombre: this.userForm.get('nombre')?.value,
        cargo: this.userForm.get('cargo')?.value,
        isAdmin: is_admin
      };
      this.pdiService.editarUsuario(USER, parseInt(this.id!)).subscribe(
        (response) => {
          this.toastr.success('Datos ingresados correctamente', 'Usuario Actualizado!');
          this.router.navigate(['/gestion-usuarios']);
        },
        (error) => {
          this.toastr.error('Ha ocurrido un error', 'Usuario No Actualizado');
          this.router.navigate(['/gestion-usuarios']);
        }
      );
    }
  }

  esEditar(){
    if (this.id != null){
      this.titulo = "Editar Datos de Usuario";
      this.isEditar = true;
      this.contraLabel = 'Nueva Contraseña';
      this.pdiService.getUsuario(parseInt(this.id)).subscribe((user) => {
        this.userData = user;
        if(this.userData == null){
          this.router.navigate(['/mapa-estrategico']);
          return;
        }

        //Desactivar forms no usados:
        this.userForm.removeControl('verify_correo');
        this.userForm.get('contrasena')?.clearValidators();  // Limpiar validadores anteriores
        this.userForm.get('contrasena')?.setValidators([Validators.minLength(8)]);  // Aplicar nuevo validador
        this.userForm.get('contrasena')?.updateValueAndValidity();  // Actualizar el estado del control
        
        this.userForm.get('verify_pass')?.clearValidators();  // Limpiar validadores anteriores
        this.userForm.get('verify_pass')?.setValidators([Validators.minLength(8)]);  // Aplicar nuevo validador
        this.userForm.get('verify_pass')?.updateValueAndValidity();  // Actualizar el estado del control
        this.userForm.setValidators([
          Validation.match('contrasena', 'verify_pass')  // Solo mantener el validador de contraseñas
        ]);
        
        this.userForm.updateValueAndValidity();
        
        const admini = user.is_admin
        var isAdmina = false
        if (admini == 1){
          isAdmina = true
        }
        this.userForm.patchValue({
          nombre: user.nombre,
          correo: user.correo,
          cargo: user.cargo,
          admin: isAdmina
        })
        this.userForm.get('correo')?.clearValidators();
        this.userForm.get('correo')?.updateValueAndValidity();  // Actualizar el estado de validez del control
        this.userForm.get('correo')?.disable(); 
        this.userForm.updateValueAndValidity();
      })
    }
  }
}
