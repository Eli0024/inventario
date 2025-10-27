export interface Impresora {
    id?: number;
    nombre: string;
    direccion_ip:string;
  }
  
  export interface Mantenimpre {
      id: number;
      impresora: Impresora;
      impresora_id:number;
      fecha: string;
      descripcion: string;
      realizado_por: string;
      
    }
    
