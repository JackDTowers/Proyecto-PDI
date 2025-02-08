import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PdiService } from 'src/app/services/pdi.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContraComponent } from './dialog-contra/dialog-contra.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  logo = 'assets/FACULTAD ODONTOLOGIA-02-modified.png';
  isLoggedAdmin = false;
  user = ''

  constructor( private router: Router, private toastService: ToastrService, private pdiService: PdiService, private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.isLoggedAdmin = this.pdiService.isAdmin();
    this.user = this.pdiService.getUserNameLogged();
  }

  abrirCambiarContra(): void{
    this.dialog.open(DialogContraComponent, {width: '500px'});
  }

  cerrarSesion(): void {
    // Elimina la cookie llamada 'token'
    this.pdiService.logout();
    this.user = "";
  }
}
