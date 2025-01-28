import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PdiService } from 'src/app/services/pdi.service';
import Validation from '../../../utils/validation';
import { MyErrorStateMatcher, TypeForm } from '../../crear-usuario/crear-usuario.component';

interface FormatContraForm {
  claveAntigua: string;
  claveNueva: string;
  claveRepetida: string
}

@Component({
  selector: 'app-dialog-contra',
  templateUrl: './dialog-contra.component.html',
  styleUrls: ['./dialog-contra.component.css']
})
export class DialogContraComponent {
  contraForm : FormGroup;
  matcher = new MyErrorStateMatcher();
  id: number = 0;
  fetching = false;
  types: TypeForm[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogContraComponent>,
    private formBuilder: FormBuilder,
    private pdiService: PdiService,
    private toastr: ToastrService,
  ) {
    this.contraForm = this.formBuilder.group(
      {
        old_pass: ['', [Validators.required]],
        new_pass: ['', [Validators.required, Validators.minLength(8)]],
        rep_new_pass: ['', [Validators.required]],
      },
      {
        validators: [Validation.match('new_pass', 'rep_new_pass')]
      }
    )
    this.id = this.pdiService.getUserIdLogged();
    for (let i = 0; i < 3; i++){
      this.types.push({typeForm: 'password', iconView: 'visibility_off'})
    }
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

  cambiarContra(){
    this.fetching = true;
    this.contraForm.disable();
    this.contraForm.updateValueAndValidity();
    const datosForm: FormatContraForm = {
      claveAntigua: this.contraForm.value.old_pass,
      claveNueva: this.contraForm.value.new_pass,
      claveRepetida: this.contraForm.value.rep_new_pass
    }
    this.pdiService.cambiarClave(datosForm, this.id).subscribe({
      next: () => {
        this.toastr.success('La contraseña ha sido cambiada con éxito', 'Clave actualizada');
        this.dialogRef.close(true)
      },
      error: (err) => {
        this.fetching = false;
        this.contraForm.enable();
        if (err.status == 400){
          this.toastr.error('Contraseña antigua erronea', 'Error', {
            positionClass: 'toast-bottom-center',
          });
        }
        else{
          this.toastr.error('Ha ocurrido un error al intentar cambiar la contraseña', 'Error');
        }
      }
    })
  }

}
