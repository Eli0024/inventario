export interface Equipo {
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
  responsable: {
    nombre: string;
    apellido: string;
  };
}
