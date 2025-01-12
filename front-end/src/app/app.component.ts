import { Component, inject, OnInit } from '@angular/core';
import { PdiService } from './services/pdi.service';
import { AutoLogoutService } from './services/auto-logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'front-end PDI';
  pdiService = inject(PdiService)

  constructor(private autoLogoutService: AutoLogoutService){
  }

  ngOnInit(): void {
    // Iniciar el servicio de auto-logout
    this.autoLogoutService;
  }
}
