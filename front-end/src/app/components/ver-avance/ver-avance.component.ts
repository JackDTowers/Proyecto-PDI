import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { Avance } from 'src/app/models/avance';

@Component({
  selector: 'app-ver-avance',
  templateUrl: './ver-avance.component.html',
  styleUrls: ['./ver-avance.component.css']
})
export class VerAvanceComponent {
  id: string | null;
  avance : Avance | undefined;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.pdiService.getAvance(this.id!).subscribe((avance) => {
      this.avance = avance;
    })
  }
}
