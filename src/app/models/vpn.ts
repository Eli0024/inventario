
export  interface ContrasenaVPN {
    id?: number;
    direccion_ip: string;
    usuario: string;
    contrasena: string;
    archivo: File | null;
}