import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';
import { PdiService } from 'src/app/services/pdi.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent {
  logo = '../../../assets/img/iconogrande.png';
  loginForm : FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private pdiService: PdiService,
    private router: Router,
  ){
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
    });
    localStorage.removeItem('token'); //por si se devuelve al login cierra sesión
  }

  ingresar(){
    if(this.loginForm.valid){
      this.pdiService.login(this.loginForm.value).pipe(
        catchError((error) => {
          //Manejar errores
          if(error.status === 401){
            this.toastr.error('Credenciales incorrectas', 'No se pudo iniciar sesión');
          }
          else{
            this.toastr.error('Ha ocurrido un error', 'No se pudo iniciar sesión');
          }
          return EMPTY; // Retornamos un observable vacío para manejar el error y continuar el flujo
        })
      ).subscribe((resultados) => {
        this.toastr.success('Credenciales correctas', 'Se ha iniciado sesión');
        localStorage.setItem('token', resultados.token);
        this.router.navigate(['/mapa-estrategico']);
      });
    }
  }

}
