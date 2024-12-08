export interface User {
  id_cuenta?: number;
  correo: string;
  contrasena?: string;
  nombre: string;
  cargo: string;
  isAdmin: number;
}