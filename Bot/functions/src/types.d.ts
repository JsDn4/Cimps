export interface horario {
    hora: string;
    valor: number;
    cantidadLugaresDispobibles?: number;
}

export type horarios = Array<horario>;

export interface Payload {
    text: string;
    callback_data: string;
}

export type PayloadArray = Array<Payload>;