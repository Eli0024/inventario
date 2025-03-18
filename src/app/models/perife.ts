export interface Periferico {

   responsable: Responsable;
   
    id_peri: number;
    nombre: string;
    modelo: string;
    numero_serie: string;
    fecha_adquisicion: string;
  }
  
  export interface Responsable {
    nombre: string;
    apellido: string;
  }
  