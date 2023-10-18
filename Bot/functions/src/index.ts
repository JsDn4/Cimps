//imports
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as queries from "./helpers/db/queries";
import * as res from "./helpers/res/respuestas";
import { MenuCompleto, Respuesta, horarios, tipoReservaciones } from "./types";

export const app = onRequest(async (request, response) => {

    try {



        if (request.method === "GET") {
            response.status(403).send("Ups! No cuenta con permiso para acceder a este recurso.");
        } else if (request.method === "POST") {

            let result: Respuesta;

            const context = request.body.queryResult.intent.displayName;

            switch (context) {

                case 'Default Welcome Intent':

                    result = res.respuestaDialogflow(
                        '¡Hola! soy un bot dedicado a las operaciones básicas de un restaurante.'
                    );

                    res.agregarTexto(
                        result,
                        'Puedes pedirme que te muestre el menú, hacer una reservación'
                    );

                    res.agregarInlineKeyboard(
                        result,
                        '¿Qué deseas hacer?',
                        [
                            {
                                text: 'Ver menú',
                                callback_data: 'menu'
                            },
                            {
                                text: 'Hacer una reservación',
                                callback_data: 'reservacion'
                            }
                        ]
                    );

                    response.status(200).send(result);

                    break;

                /**
                 * Hacer una reservacion
                 */
                case 'reservacion':

                    result = res.respuestaDialogflow(
                        'Por favor escriba su primer nombre y un apellido'
                    );

                    response.status(200).send(result);

                    break;

                case 'reservacionNombreCompleto':

                    result = res.respuestaDialogflow(
                        'Muy bien, ahora continuaremos con su numero telefónico'
                    );

                    response.status(200).send(result);

                    break;

                case 'reservacionNumeroTelefono':

                    result = res.respuestaDialogflow('');

                    //Obtener el numero telefonico
                    const { numeroTelefono } = request.body.queryResult.parameters;

                    //convertir el numero telefonico a string
                    const numeroTelefonoString: string = numeroTelefono.toString();

                    //Verificar que el numero telefonico tenga 10 digitos
                    if (numeroTelefonoString.length != 10) {

                        res.agregarTexto(
                            result,
                            'Lo siento. El numero telefónico debe tener 10 dígitos, por favor intente de nuevo.'
                        );

                    } else {

                        //Verificar si el numero telefonico ya tiene una reservacion activa
                        const reservacionActiva = await queries.consultarReservacionActiva(numeroTelefonoString);

                        if (reservacionActiva.length > 0) {
                            res.agregarTexto(result, 'Lo siento, pero ya cuenta con una reservacion activa')
                        } else {

                            res.agregarTexto(result, 'Muy bien, ahora continuaremos con el tipo de reservacion');

                            const tipoReservaciones: tipoReservaciones | string = await queries.consultarTipoReservacion();


                            if (typeof tipoReservaciones !== 'string') {
                                res.agregarInlineKeyboard(
                                    result,
                                    '¿Qué tipo de reservacion desea?',
                                    tipoReservaciones.map((tipo) => ({
                                        text: tipo.descripcion,
                                        callback_data: `tipo ${tipo.valor}`
                                    }))
                                );
                            } else {

                                res.agregarTexto(result, tipoReservaciones);

                            }

                        }

                    }
                    response.status(200).send(result);

                    break;

                case 'reservacionTipoReservacion':

                    result = res.respuestaDialogflow('Muy bien, ahora continuemos con la fecha de la reservacion');

                    //array de fechas entre mañana y 1 semana despues

                    //Fecha de hoy
                    const fechaInicial = new Date();
                    fechaInicial.setDate(fechaInicial.getDate() + 1);

                    //Inicializar array de fechas
                    const fechas: Array<Date> = [];

                    //Agregar fechas al array
                    for (let i = 0; i < 7; i++) {
                        const fecha = new Date();
                        fecha.setDate(fechaInicial.getDate() + i);
                        fechas.push(fecha);
                    }

                    //Convertir las fechas a yyyy-mm-dd
                    const fechasString: Array<string> = fechas.map((fecha) => fecha.toLocaleDateString());


                    //Enviar las fechas a InlineKeyboard
                    res.inLineKeyboard1x1(
                        result,
                        '¿Qué fecha desea? - *MM/DD/YYYY*',
                        fechasString.map((fecha) => ({
                            text: fecha,
                            callback_data: `fecha ${fecha}`
                        }))
                    );

                    response.status(200).send(result);

                    break;

                case 'reservacionFecha':

                    const { fecha } = request.body.queryResult.parameters;
                    const { tipoReservacion } = request.body.queryResult.outputContexts[1].parameters;

                    result = res.respuestaDialogflow('Muy bien, ahora continuemos con la hora de la reservacion');

                    const horasDisponibles: horarios | string = await queries.consultarFechasDisponibles(tipoReservacion, fecha);

                    if (typeof horasDisponibles === 'string') {

                        res.agregarTexto(result, horasDisponibles);

                    } else {

                        //ordenar las horas disponibles de menor a mayor
                        horasDisponibles.sort((a, b) => {
                            if (a.hora < b.hora) {
                                return -1;
                            }
                            if (a.hora > b.hora) {
                                return 1;
                            }
                            return 0;
                        });

                        res.inLineKeyboard1x1(
                            result,
                            '¿Qué hora desea?',
                            horasDisponibles.map((hora) => ({
                                text: hora.hora,
                                callback_data: `hora ${hora.hora}`
                            }))


                        );

                    }

                    response.status(200).send(result);

                    break;

                case 'reservacionHora':

                    result = res.respuestaDialogflow('Muy bien, Continuaremos con el numero de lugares a reservar');

                    res.agregarTexto(result, '');

                    const tipoReservacionResHora: number = request.body.queryResult.outputContexts[3].parameters.tipoReservacion;
                    const fechaReservacionResHora: string = request.body.queryResult.outputContexts[3].parameters.fecha;
                    const horaReservacionResHora: string = request.body.queryResult.outputContexts[3].parameters['hora.original'];

                    const lugaresDisponibles = await queries.consultarFechasDisponibles(tipoReservacionResHora, fechaReservacionResHora);

                    logger.info(lugaresDisponibles);

                    if (typeof lugaresDisponibles === 'string') {
                        res.agregarTexto(result, lugaresDisponibles);
                    } else {

                        const lugaresDisponiblesNumero = lugaresDisponibles.find((horario) => horario.hora === horaReservacionResHora)?.cantidadLugaresDispobibles;

                        if (typeof lugaresDisponiblesNumero === 'number') {

                            //Obtener un array de numeros desde 1 hasta el numero de lugares disponibles
                            const numeros = Array.from(Array(lugaresDisponiblesNumero), (_, i) => i + 1);

                            res.inLineKeyboard1x1(
                                result,
                                '¿Cuantos lugares desea reservar?',
                                numeros.map((numero) => ({
                                    text: numero.toString(),
                                    callback_data: `Lugar ${numero}`
                                }))
                            );

                        } else {
                            res.agregarTexto(result, 'No entro');
                        }
                    }

                    response.status(200).send(result);

                    break;

                case 'reservacionLugaresReservar':

                    result = res.respuestaDialogflow('Muy bien, ahora agendamos su reservacion');


                    const parameters = request.body.queryResult.outputContexts[4].parameters;

                    logger.info(parameters);

                    //Tomado de los parametros
                    const fechaReservacion: string = parameters.fecha;
                    const horaReservacion: string = parameters.hora;
                    const numeroTelefonoReservacion: string = parameters['numeroTelefono.original'];
                    const nombreCompletoReservacion: string = parameters['nombreCompleto.original'];
                    const tipoReservacionReservacion: number = parameters.tipoReservacion;
                    const numeroLugares: number = parameters.numeroLugares;

                    //Tomar los 10 digitos de fecha
                    const fechaString = fechaReservacion.slice(0, 10);

                    //Reemplazar los caracteres de fecha en los primeros 10 caracteres de hora
                    const fechaHora = horaReservacion.replace(horaReservacion.slice(0, 10), fechaString);


                    logger.info(fechaHora);
                    logger.info(numeroTelefonoReservacion);
                    logger.info(nombreCompletoReservacion);
                    logger.info(tipoReservacionReservacion);
                    logger.info(numeroLugares);
                    // Enviar a la base de datos
                    const resultadoCreacion = await queries.crearReservacion(
                        fechaHora,
                        numeroTelefonoReservacion,
                        nombreCompletoReservacion,
                        tipoReservacionReservacion,
                        numeroLugares
                    );


                    logger.info(resultadoCreacion);
                    //Verificar que el numero enviado no sea mayor a los lugares disponibles

                    if (typeof resultadoCreacion === 'string') {
                        res.agregarTexto(result, 'Su reservacion ha sido creada con éxito.');
                        res.agregarTexto(result, `Su ID de reservacion es: ${resultadoCreacion}`);
                        res.agregarTexto(result, 'Recuerda que es importante guardarlo, se pedirá al momento de entrar al restaurante.');
                    } else if (resultadoCreacion.err) {
                        res.agregarTexto(result, 'Lo siento, ha ocurrido un error en nuestra base de datos.');
                        res.agregarTexto(result, resultadoCreacion.mensaje);
                    }

                    //Respuesta al usuario
                    if (resultadoCreacion === 'Hubo un error en la base de datos') {
                        res.agregarTexto(result, 'Lo siento, ha ocurrido un error en nuestra base de datos.');
                        res.agregarTexto(result, resultadoCreacion);
                    } else {
                        res.agregarTexto(result, 'Su reservacion ha sido creada con éxito.');
                        res.agregarTexto(result, `Su ID de reservacion es: ${resultadoCreacion}`);
                        res.agregarTexto(result, 'Recuerda que es importante guardarlo, se pedirá al momento de entrar al restaurante.');
                    }

                    response.status(200).send(result);

                    break;

                case 'verMenu':

                    result = res.respuestaDialogflow('Muy bien, aqui esta nuestro menu');

                    const menu: MenuCompleto | string = await queries.consultarMenu();

                    if (typeof menu === 'string') {

                        res.agregarTexto(result, menu);

                    } else {

                        menu.forEach((platillo) => {
                            logger.info(platillo);
                            res.card(
                                result,
                                platillo.descripcionPlatillo,
                                `$ ${platillo.precio.toString()}`,
                                platillo.imagen
                            );
                        });

                    }

                    response.status(200).send(result);

                    break;


                case 'Default Fallback Intent':

                    const { queryText } = request.body.queryResult;

                    result = res.respuestaDialogflow('Lo siento, no entiendo lo que quieres decir.');

                    res.agregarTexto(result, 'Lo siento, no entiendo lo que quieres decir.');
                    res.agregarTexto(result, `Tu mensaje fue: ${queryText}`);

                    response.status(200).send(result);

                    break;

            }



        }

    } catch (error) {
        logger.error(error);
        let result = res.respuestaDialogflow('Lo siento, ha ocurrido un error en el servidor.');

        //Enviar el error al usuario

        response.status(200).send(res.agregarTexto(result, 'Lo siento, ha ocurrido un error en el servidor.'));
    }

});