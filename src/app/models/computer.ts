// models.ts
export interface Responsable {
  id: number; 
  nombre: string;
  apellido: string;
}

export interface Equipo {

  responsable: Responsable;
  // otros campos que puedan existir en tu modelo `RegistrarEquipo`
  // por ejemplo:
  id?: number;
  marca: string;
  memoria: string;
  modelo: string;
  procesador: string;
  office: string;
  serial: string;
  sistema_operativo: string;
  fecha_adquisicion: string;
  estado: string;
  archivo: File | null;
  // etc.
}

