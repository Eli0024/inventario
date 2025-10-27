export interface Empresa {
    id: number;
    nombre: string;
}

export interface Colaborador {
    id: number;
    nombre: string;
    apellido: string;
    empresa: Empresa;
    empresa_id: number;
    area: string|null;
    cargo: string;
}


