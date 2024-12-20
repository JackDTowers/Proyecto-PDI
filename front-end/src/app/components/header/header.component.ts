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
  isLoggedAdmin = true;
  id = ''
  constructor( private router: Router, private toastService: ToastrService ) { }
  ngOnInit(): void {

  }
  cerrarSesion(): void {
    // Elimina la cookie llamada 'token'
    localStorage.removeItem('token');
    this.id = "";
    //this.isLoggedAdmin = false;
    this.toastService.info('Se ha cerrado sesión')
    this.router.navigate(['/login'])
  }
}
