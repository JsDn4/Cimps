import { initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
// import * as logger from "firebase-functions/logger";

initializeApp();

const db = getFirestore();

export const consultarReservacionesDelDia = async () => {

    try {

        const reservacionesRef = await db.collection('reservaciones');

        //Hora 1 am
        const diaHoy = new Date();
        diaHoy.setHours(1, 0, 0, 0);

        const limite = new Date();
        limite.setHours(23, 59, 59, 0);

        const query = await reservacionesRef
            .where('fechaHora', '>', Timestamp.fromDate(diaHoy))
            .where('fechaHora', '<', Timestamp.fromDate(limite))
            .get();

        const reservaciones = query.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        return reservaciones;
    } catch (error) {
        return 'Hubo un error en la base de datos';
    }


}


export const consultarTiposDeReservacion = async () => {

    try {

        const tiposDeReservacionRef = await db.collection('tipoReservacion');

        const query = await tiposDeReservacionRef.get();

        const tiposDeReservacion: Array<TipoReservacion> = query.docs.map(doc => {
            return {
                id: doc.id,
                descripcion: doc.data().descripcion,
                cantidadLugaresDisponibles: doc.data().cantidadLugaresDisponibles,
                valor: doc.data().valor
            }
        });

        return tiposDeReservacion;
    } catch (error) {
        return 'Hubo un error en la base de datos';
    }
}

export const agregarTipoDeReservacion = async (tipoDeReservacion: TipoReservacion) => {

    try {

        const tipoDeReservacionRef = await db.collection('tipoReservacion');

        const query = await tipoDeReservacionRef.add(tipoDeReservacion);

        return query;
    } catch (error) {
        return 'Hubo un error en la base de datos';
    }
}

export const actualizarTipoDeReservacion = async (tipoDeReservacion: TipoReservacion) => {

    try {
        if (!tipoDeReservacion.id) {
            throw new Error('El tipo de reservación no tiene un ID válido');
        }

        const tipoDeReservacionRef = await db.collection('tipoReservacion').doc(tipoDeReservacion.id);

        const query = await tipoDeReservacionRef.update({ ...tipoDeReservacion })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });

        return query;

    } catch (error) {
        return 'Hubo un error en la base de datos';
    }
}

