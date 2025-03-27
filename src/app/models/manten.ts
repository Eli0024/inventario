export interface Responsable {
  nombre: string;
  apellido: string;
}

export interface Mantenimiento {

   responsable: Responsable;
   
    id: number;
    equipo: string;
    fecha: string;
    tipo: string;
    descripcion: string;
  }
  