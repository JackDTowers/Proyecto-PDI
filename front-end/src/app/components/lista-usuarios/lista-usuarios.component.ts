import { Component } from '@angular/core';
import { PdiService } from 'src/app/services/pdi.service';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent {
  isLoggedAdmin = false;
  usuarios : User[] | undefined;
  displayedColumns : string[] = ['Nombre', 'Correo', 'Cargo', 'Rol', 'Acciones'];

  constructor(
    private pdiService: PdiService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ){
    this.isLoggedAdmin = this.pdiService.isAdmin();
    this.pdiService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    })
  }

  eliminarUsuario(id: number, correo: string){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        tittle: 'Eliminar Usuario', 
        content: '¿Estás seguro de eliminar la cuenta de usuario asociada al correo ' + correo + '? Esta acción será irreversible.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.pdiService.eliminarUsuario(id).subscribe((response) => {
          this.toastr.success('Cuenta de usuario eliminada con éxito', 'Usuario Eliminado');
          // Navegar a la misma ruta para reiniciar el componente
          this.router.navigateByUrl('/ges', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/gestion-usuarios']);
          });
        },
        (error) => {
          if (error.status === 409){
            this.toastr.error('No se puede eliminar el usuario porque tiene planes asociados', 'Usuario no eliminado');
          }
          else{
            this.toastr.error('Ha ocurrido un error al intentar eliminar el usuario', 'Usuario no eliminado');
          }
        });
      }
    });
  }
}
