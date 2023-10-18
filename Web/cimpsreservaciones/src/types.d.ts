
export interface TipoReservacion {
    id?: string;
    descripcion: string;
    cantidadMesas?: number;
    cantidadLugaresDisponibles: number;
    valor?: number;
}

export interface ruta {
    titulo: string;
    subruta?: string;
    tituloVista: string;
}

export interface Menu {
    id: string;
    precio: number;
    descripcionPlatillo: string;
    imagen: string;
}

export type rutas = Array<ruta>;