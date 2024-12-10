import { Objetivo } from "./objetivo";

export interface Eje {
  eje_id?: number;
  numero_eje: number;
  nombre_eje: string;
  objetivos: Objetivo[]
}