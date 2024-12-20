import { Component, inject } from '@angular/core';
import { PdiService } from './services/pdi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end PDI';
  pdiService = inject(PdiService)
}
