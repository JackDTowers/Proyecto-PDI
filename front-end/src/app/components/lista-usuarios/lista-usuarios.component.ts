import { Component } from '@angular/core';
import { PdiService } from 'src/app/services/pdi.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent {
  isLoggedAdmin = false;
  usuarios : User[] | undefined;
  displayedColumns : string[] = ['Nombre', 'Correo', 'Cargo', 'Acciones'];

  constructor(
    private pdiService: PdiService,
  ){
    this.isLoggedAdmin = this.pdiService.isAdmin();
    this.pdiService.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    })
  }

  eliminarUsuario(id: number){
    console.log(id)
  }
}
