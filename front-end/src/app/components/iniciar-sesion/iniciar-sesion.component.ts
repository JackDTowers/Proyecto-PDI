import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../crear-usuario/crear-usuario.component';
import { PdiService } from 'src/app/services/pdi.service';
import { ToastrService } from 'ngx-toastr';

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
  ){
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
    })
  }

  ingresar(){

  }

}
