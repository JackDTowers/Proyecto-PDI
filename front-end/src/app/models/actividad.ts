import { Avance } from "./avance";

export interface Actividad {
  desc_act: string; //antes: nombre_actividad
  responsable: string;
  plazo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  avances?: Avance[];
}