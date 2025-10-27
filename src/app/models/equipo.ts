export interface Responsable {
    id:number
    nombre: string;
    apellido: string;
}  

export interface Empresa {
    id: number;
    nombre: string;
}

export interface ContrasenaEquipo {
    id:number;
    usuario: string;
    correo?:string|null;
    contrasena: string;
    responsable: Responsable;
    empresa?: Empresa;
    archivo: File | null;
    
}

