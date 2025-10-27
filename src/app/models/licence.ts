export interface Responsable {
    id: number;
    nombre: string;
    apellido: string;
}

export class Equipo {
    id?: number;
    marca?: string='' ;
    serial?: string='';
    responsable?: Responsable | null ;
}    

export interface Licence {
    id?: number;
    tipo_licencia: string;
    correo?: string|null;
    contrasena?: string|null;
    clave_producto: string;
    fecha_compra: string|null;
    equipo: Equipo|null;
    equipo_id?: number|null;
}
