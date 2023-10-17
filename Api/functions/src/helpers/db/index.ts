import { initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
// import * as logger from "firebase-functions/logger";

initializeApp();

const db = getFirestore();

export const consultarReservacionesDelDia = async () => {

    try {

        const reservacionesRef = await db.collection('reservaciones');

        //Hora 0 am
        const diaHoy = new Date();
        diaHoy.setHours(10, 0, 0, 0);

        const limite = new Date();
        limite.setHours(23, 59, 59, 999);

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

export const agregarTipoDeReservacion = async (
    descripcion: string,
    cantidadLugaresDisponibles: number,
) => {

    try {

        const tipoDeReservacionRef = await db.collection('tipoReservacion');

        const valorMaximoQuery = await tipoDeReservacionRef
            .orderBy('valor', 'desc')
            .limit(1)


        const valorMaximo = await valorMaximoQuery.get();

        const query: boolean = await tipoDeReservacionRef.add({
            descripcion,
            cantidadLugaresDisponibles,
            valor: valorMaximo.docs[0].data().valor + 1
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });

        return query;
    } catch (error) {
        return 'Hubo un error en la base de datos';
    }
}

export const actualizarTipoDeReservacion = async (
    id: string,
    descripcion: string,
    cantidadLugaresDisponibles: number,
    valor: number
) => {

    try {
        if (!id) {
            throw new Error('El tipo de reservación no tiene un ID válido');
        }

        const tipoDeReservacionRef = await db.collection('tipoReservacion').doc(id);

        const query = await tipoDeReservacionRef.update({
            descripcion,
            cantidadLugaresDisponibles,
            valor
        })
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

export const eliminarTipoDeReservacion = async (id: string) => {

    try {

        const numeroReservaciones = await consultarTiposDeReservacion();

        if (numeroReservaciones.length === 1) {
            throw new Error('No se puede eliminar el último tipo de reservación');
        }

        const tipoDeReservacionRef = await db.collection('tipoReservacion').doc(id);

        const query = await tipoDeReservacionRef.delete()
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

