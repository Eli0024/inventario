export interface Equipo {
    id_equipo: number;
    marca: string;
    memoria: string;
    procesador: string;
    office: string;
    serial: string;
    windows: string;
    sistema_operativo: string;
    fecha_adquisicion: string;
    estado: string;
    responsable: any;  // Puedes usar un modelo más específico aquí si es necesario
    archivo: File | null;  // Asegúrate de que sea 'File' o 'null'
  }
  