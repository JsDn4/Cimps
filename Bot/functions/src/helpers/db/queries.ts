import { initializeApp } from 'firebase-admin/app';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { horarios } from '../../types';

initializeApp();

const db = getFirestore();

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
            // const reservacionesPorHora = query.docs.filter((doc) => {

            //     const horaReservacion = doc.data().fechaHora.
            //         toDate().
            //         toLocaleTimeString(
            //             'en-US',
            //             {
            //                 timeZone: 'America/Mazatlan',
            //                 hour: '2-digit',
            //                 minute: '2-digit',
            //                 second: '2-digit',
            //                 hour12: false
            //             }
            //         );

            //     return horaReservacion === horario.hora;

            // }).length;

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

                logger.info(`Horario: ${JSON.stringify(horario)}`)
                logger.info(`Hora reservacion: ${horaReservacion}`)
                logger.info(acumulador)

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
