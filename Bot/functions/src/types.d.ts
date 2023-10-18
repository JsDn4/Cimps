export interface Plataforma {
    platform: string;
    text: {
        text: string[];
    };
}

export interface Card {

    card: {
        title: string;
        subtitle: string;
        imageUri: string;
    };
    platform: string;
}


export interface InlineKeyboard {
    payload: {
        telegram: {
            reply_markup: {
                inline_keyboard: Array<PayloadArray> | PayloadArray;
            };
            text: string;
        };
    };
    platform: string;
}

export interface Respuesta {
    fulfillmentText: string;
    fulfillmentMessages: (Plataforma | InlineKeyboard | Card)[];
}

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


interface tipoReservacion {
    valor: number;
    cantidadLugaresDisponibles: number;
    descripcion: string;
}

export type tipoReservaciones = Array<tipoReservacion>;

export interface menu {
    descripcionPlatillo: string;
    imagen: string;
    precio: number;
}
type MenuCompleto = Array<menu>;

