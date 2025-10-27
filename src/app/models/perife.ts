export interface Periferico { 
  id: number;
  nombre: string;
  modelo: string;
  numero_serie: string;
  fecha_adquisicion: string;
  responsable: Responsable;
  responsable_id: number;
}
  
export interface Responsable {
  id: number;
  nombre: string;
  apellido: string;
}

  