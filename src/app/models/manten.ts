export interface Responsable{
  id: number;
  nombre: string;
  apellido: string;
}

export interface Equipo {
  id: number;
  marca: string;
  serial: string;
  responsable: Responsable;
}

export interface Mantenimiento {
  id: number;
  equipo: Equipo;
  equipo_id: number;
  fecha_mantenimiento: string;
  tipo_mantenimiento: 'preventivo' | 'correctivo'| 'predictivo';
  tipo_servicio:'software' | 'hardware' | 'ambos';
  descripcion: string;
  realizado_por: string;
}
  