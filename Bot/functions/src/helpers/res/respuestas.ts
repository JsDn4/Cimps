import { Payload, PayloadArray, Respuesta } from "../../types";


/**
 * Genera una respuesta básica de Dialogflow.
 * @param texto Texto a enviar.
 * @returns Respuesta básica de Dialogflow.
 */
export const respuestaDialogflow = (texto: string): Respuesta => {
    const res: Respuesta = {
        fulfillmentText: texto,
        fulfillmentMessages: [
            {
                platform: 'TELEGRAM',
                text: {
                    text: [texto],
                },
            },
        ],
    };

    return res;
};

/**
 * Agrega texto a la respuesta de Dialogflow.
 * @param respuesta Respuesta de Dialogflow a la que se agregará el texto.
 * @param texto Texto a agregar a la respuesta.
 * @returns Respuesta con el texto agregado.
 */
export const agregarTexto = (respuesta: Respuesta, texto: string): Respuesta => {
    respuesta.fulfillmentMessages.push({
        platform: 'TELEGRAM',
        text: {
            text: [texto],
        },
    });

    return respuesta;
};

/**
 * Agrega un teclado en línea a la respuesta de Dialogflow.
 * @param respuesta Respuesta de Dialogflow a la que se agregará el teclado en línea.
 * @param texto Texto que se mostrará en el teclado en línea.
 * @param opciones Opciones para el teclado en línea.
 * @returns Respuesta con el teclado en línea agregado.
 */
export const agregarInlineKeyboard = (respuesta: Respuesta, texto: string, opciones: Array<Payload>): Respuesta => {
    const payload: Payload[] = opciones.map((opcion) => ({
        text: opcion.text,
        callback_data: opcion.callback_data,
    }));


    respuesta.fulfillmentMessages.push({
        platform: 'TELEGRAM',
        payload: {
            telegram: {
                reply_markup: {
                    inline_keyboard: [payload],
                },
                text: texto,
            },
        },
    });


    return respuesta;
};

export const inLineKeyboard1x1 = (respuesta: Respuesta, texto: string, opciones: Array<Payload>): Respuesta => {
    const payloadArg: PayloadArray = opciones.map((opcion) => ({
        text: opcion.text,
        callback_data: opcion.callback_data,
    }));

    const inlineKeyboard = payloadArg.map((payload) => [payload]);


    respuesta.fulfillmentMessages.push({
        platform: 'TELEGRAM',
        payload: {
            telegram: {
                reply_markup: {
                    inline_keyboard: inlineKeyboard,
                },
                text: texto,
            },
        },
    });

    return respuesta;
}

export const card = (respuesta: Respuesta, titulo: string, subtitulo: string, imagen: string): Respuesta => {

    respuesta.fulfillmentMessages.push({
        platform: 'TELEGRAM',
        card: {
            title: titulo,
            subtitle: subtitulo,
            imageUri: imagen,
        }
    });

    return respuesta;
}