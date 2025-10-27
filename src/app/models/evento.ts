export interface Evento{
    id:number;
    titulo:string;
    fecha_inicio:string;
    fecha_fin?:string|null|undefined;
    color?:string|null|undefined;
    hora_inicio?: string;
    hora_fin?: string;
}