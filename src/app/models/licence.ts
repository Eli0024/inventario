export interface Responsable {
    nombre: string;
    apellido: string;
  }

export interface Licence {
     
    responsable: Responsable;

    id: number;
    correo: string;
    contrasena: string;
    serial_office: string;
}
