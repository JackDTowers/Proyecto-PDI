import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  logo = '../../../assets/img/logo.png';
  isLogged = true;
  isLoggedAdmin = true;
  id = ''
  constructor() { }
  ngOnInit(): void {

  }
  cerrarSesion(): void {
    // Elimina la cookie llamada 'token'
    this.id = "";
    this.isLogged = false;
    this.isLoggedAdmin = false;
  }
}
