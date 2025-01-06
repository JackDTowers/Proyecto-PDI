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
  nombresArchivo: string[] | undefined;

  constructor(
    private aRouter: ActivatedRoute,
    private pdiService: PdiService,
    private toastr: ToastrService,
  ){
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.pdiService.getAvance(this.id!).subscribe((avance) => {
      this.avance = avance;
      if (this.avance.archivos && this.avance.archivos.length > 0) {
        this.nombresArchivo = this.avance.archivos.map(archivo => archivo.nombre);
      }
    })
  }

  descargarArchivo(nombreArchivo: string, archivoId: number) {
    this.pdiService.getFIle(archivoId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo; // Nombre sugerido para el archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.log(error)
      this.toastr.error('Ha ocurrido un error', 'No se pudo descargar el archivo');
    });
  }
}
