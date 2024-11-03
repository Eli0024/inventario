export class Equipo {
    id_equipo!: number;
    marca!: string;
    modelo!: string;
    memoria!: string;
    procesador!: string;
    office!: string;
    serial!: string;
    serial_office!: string;
    fecha_adquisicion!: string;
    vida_util!: number;
    estado!: string;
    responsable!: { id: number; nombre: string }; 
    archivo!: File;
}
