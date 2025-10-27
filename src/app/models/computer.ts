
export interface Responsable {
  id: number; 
  nombre: string;
  apellido: string;
}

export interface Equipo {
  id: number;
  marca: string;
  memoria: string;
  modelo: string;
  procesador: string;
  office: string;
  serial: string;
  sistema_operativo: string;
  fecha_adquisicion: string;
  estado: string;
  responsable: Responsable;
  responsable_id?: number;
  archivo: File | null;
}

