
export interface ContrasenaServidor {
    id?: number;
    tipo:''|'datos' |'solido'|'lineas'
    direccion_ip: string;
    contrasena: string;
    archivo: File | null;
}