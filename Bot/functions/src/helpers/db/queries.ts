import { initializeApp } from 'firebase-admin/app';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { MenuCompleto, horarios, tipoReservaciones } from '../../types';

initializeApp();

const db = getFirestore();


/**
 * 
 * @param telefono : string //Numero de telefono tomado desde los parametros del bot
 * @returns {map | string} //Mapa con los datos de la reservacion activa o un string con el error
 */
export const consultarReservacionActiva = async (telefono: string) => {

    try {

        const reservacionesRef = await db.collection('reservaciones');

        const query = await reservacionesRef
            .where('numeroTelefono', '==', telefono)
            .where('reservacionActiva', '==', 1)
            .get();

        const reservacionActiva = query.docs.map(doc => doc.data());

        return reservacionActiva;
    } catch (error) {
        return 'Hubo un error en la base de datos';
    }

}


/**
 * 
 * @param tipoReservacion : number //Tipo de reservacion tomado desde los parametros del bot
 * @param fecha : string //Fecha tomada desde los parametros del bot
 * @returns {horarios | string} //Mapa con los datos de la reservacion activa o un string con el error
 */
export const consultarFechasDisponibles = async (tipoReservacion: Number, fecha: string) => {

    try {

        //Convertir la fecha a Date UTC 
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);


        //Obtener la fecha de fin
        const fechaFin = new Date(fecha);
        fechaFin.setDate(fechaFin.getDate() + 2);

        const reservacionesRef = await db.collection('reservaciones');
        //Obtener todos los documentos entre la fecha de inicio y la fecha de fin(un dia despues)
        const query = await reservacionesRef
            .where('fechaHora', '>=', fechaInicio)
            .where('fechaHora', '<', fechaFin)
            .where('tipoReservacion', '==', tipoReservacion)
            .where('reservacionActiva', '==', 1)
            .orderBy('fechaHora')
            .limit(15)
            .get();

        //consultar la tabla de horarios
        const horariosRef = await db.collection('horarios');
        const queryHorarios = await horariosRef.get();

        //consultar tipos de reservacion 
        const tipoReservacionRef = await db.collection('tipoReservacion');
        const queryTipoReservacion = await tipoReservacionRef.get();

        //Mapeo de los datos
        const tipoReservaciones = queryTipoReservacion.docs.map(doc => doc.data());
        const horarios = queryHorarios.docs.map(doc => ({ hora: doc.data().hora, valor: doc.data().valor }));

        const cantidadMaxima: number = tipoReservaciones.find((reservacion) => reservacion.valor === tipoReservacion)?.cantidadLugaresDisponibles;


        const fechasDisponibles = horarios.map((horario) => {

            //Sumar el numero de reservaciones por hora, en el campo de cantidadLugaresDispobibles
            //Sumar el campo de cantidadLugaresDispobibles
            const reservacionesPorHora: number = query.docs.reduce((acumulador, doc) => {

                const horaReservacion = doc.data().fechaHora.
                    toDate().
                    toLocaleTimeString(
                        'en-US',
                        {
                            timeZone: 'America/Mazatlan',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        }
                    );

                if (horaReservacion === horario.hora) {
                    return acumulador + doc.data().cantidadLugaresReservados;
                } else {
                    return acumulador;
                }

            }, 0);

            logger.info(`Reservaciones por hora: ${reservacionesPorHora}`);

            //Si la cantidad de reservaciones por hora es menor a la cantidad maxima de reservaciones por hora
            //Se regresa el horario

            if (cantidadMaxima && cantidadMaxima > reservacionesPorHora) {
                return {
                    hora: horario.hora.toString(),
                    valor: horario.valor.toString(),
                    cantidadLugaresDispobibles: cantidadMaxima - reservacionesPorHora
                };
            } else {
                return null;
            }

        }).filter((horario) => horario !== null) as horarios;

        return fechasDisponibles;

    } catch (error) {
        logger.error(error);
        return 'Hubo un error en la base de datos';
    }

}


/**
 * 
 * @param fecha : string //Fecha calculada con la hora de la reservacion
 * @param numeroTelefonoReservacion : string //Numero de telefono tomado desde los parametros del bot
 * @param nombreCompletoReservacion : string //Nombre completo tomado desde los parametros del bot
 * @param tipoReservacionReservacion : number //Tipo de reservacion tomado desde los parametros del bot
 * @param cantidadLugaresReservados : number //Cantidad de lugares reservados tomado desde los parametros del bot
 * @returns {string | {err: boolean, mensaje: string}} //Id de la reservacion o un objeto con el error
 */
export const crearReservacion = async (
    fecha: string,
    numeroTelefonoReservacion: string,
    nombreCompletoReservacion: string,
    tipoReservacionReservacion: number,
    cantidadLugaresReservados: number
) => {

    try {

        const reservacionActiva = await consultarReservacionActiva(numeroTelefonoReservacion);

        if (reservacionActiva.length > 0) {
            return {
                err: true,
                mensaje: 'Ya tienes una reservacion activa'
            };
        }

        //Reservaciones ref
        const reservacionesRef = await db.collection('reservaciones');

        //Parseo de la fecha a Date
        const fechaDate = new Date(fecha);

        //Crear el documento

        const reservacion = {
            fechaHora: Timestamp.fromDate(fechaDate),
            numeroTelefono: numeroTelefonoReservacion,
            nombreCompleto: nombreCompletoReservacion,
            tipoReservacion: tipoReservacionReservacion,
            reservacionActiva: 1,
            cantidadLugaresReservados: cantidadLugaresReservados
        };

        //Agregar el documento
        const result = await reservacionesRef.add(reservacion);

        return result.id;

    } catch (error: any) {

        logger.error(error);

        return {
            err: true,
            mensaje: 'Hubo un error en la base de datos'
        };

    }

}

/**
 * 
 * @returns {tipoReservaciones | string} //Mapa con los datos de los tipos de reservacion o un string con el error
 */
export const consultarTipoReservacion = async () => {

    try {

        const tipoReservacionRef = await db.collection('tipoReservacion');

        const query = await tipoReservacionRef.get();

        const tipoReservacion: tipoReservaciones = query.docs.map(doc => {
            return {
                valor: Number(doc.data().valor),
                descripcion: doc.data().descripcion,
                cantidadLugaresDisponibles: Number(doc.data().cantidadLugaresDisponibles)
            };
        });

        return tipoReservacion;

    } catch (error) {
        return 'Hubo un error en la base de datos';
    }

}

//Funcion de mostrar menu

export const consultarMenu = async () => {

    try {

        const menuRef = await db.collection('menu');

        const query = await menuRef.get();

        const menu: MenuCompleto = query.docs.map(doc => {
            return {
                descripcionPlatillo: doc.data().descripcionPlatillo,
                imagen: doc.data().imagen,
                precio: Number(doc.data().precio)
            };
        });

        return menu;

    } catch (error) {
        return 'Hubo un error en la base de datos';
    }

}