import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PdiService } from 'src/app/services/pdi.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  logo = '../../../assets/img/logo.png';
  isLoggedAdmin = false;
  user = ''
  constructor( private router: Router, private toastService: ToastrService, private pdiService: PdiService ) { }
  ngOnInit(): void {
    this.isLoggedAdmin = this.pdiService.isAdmin();
    this.user = this.pdiService.getUserNameLogged();
  }
  cerrarSesion(): void {
    // Elimina la cookie llamada 'token'
    this.pdiService.logout();
    this.user = "";
  }
}
