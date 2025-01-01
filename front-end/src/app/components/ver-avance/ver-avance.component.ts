import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdiService } from 'src/app/services/pdi.service';
import { Avance } from 'src/app/models/avance';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ver-avance',
  templateUrl: './ver-avance.component.html',
  styleUrls: ['./ver-avance.component.css']
})
export class VerAvanceComponent {
  id: string | null;
  avance : Avance | undefined;
  nombreArchivo: string | undefined;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
    private toastr: ToastrService,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.pdiService.getAvance(this.id!).subscribe((avance) => {
      this.avance = avance;
      if (this.avance.archivo){
        this.nombreArchivo = this.avance.archivo.split('\\').pop();
      }
    })
  }

  descargar() {
    this.pdiService.getFIle(this.id!).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      console.log(blob)
      if(this.nombreArchivo){
        a.download = this.nombreArchivo; // Nombre sugerido para el archivo
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      //setTimeout(() => window.URL.revokeObjectURL(url), 100);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.log(error)
      this.toastr.error('Ha ocurrido un error', 'No se pudo descargar el archivo');
    });
  }
}
