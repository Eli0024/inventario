// models.ts
export interface Responsable {
  nombre: string;
  apellido: string;
}

export interface Equipo {

  responsable: Responsable;
  // otros campos que puedan existir en tu modelo `RegistrarEquipo`
  // por ejemplo:
  id_equipo?: number;
  marca: string;
  memoria: string;
  modelo: string;
  procesador: string;
  office: string;
  serial: string;
  windows: string;
  sistema_operativo: string;
  fecha_adquisicion: string;
  estado: string;
  archivo: File | null;
  // etc.
}

