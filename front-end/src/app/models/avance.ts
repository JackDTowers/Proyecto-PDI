export interface Avance {
  avance_id?: number;
  act_id?: number;
  nombre: string;
  descripcion: string;
  archivos?: Archivo[];
  createdAt?: Date;
}

interface Archivo {
  archivo_id: number;
  avance_id: number;
  nombre: string;
  archivo: string;
  createdAt: Date;
}