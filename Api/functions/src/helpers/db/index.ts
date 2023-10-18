import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// import * as logger from "firebase-functions/logger";

initializeApp();

const db = getFirestore();

//Tipo de reservacion funciones

/**
 * 
 * @returns {Array<TipoReservacion> | string}
 */
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


/**
 * 
 * @param descripcion : string // Descripcion del tipo de reservacion
 * @param cantidadLugaresDisponibles : number // Cantidad de lugares disponibles
 * @returns {boolean | string}
 */
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


/**
 * 
 * @param id : string // ID del documento a actualizar
 * @param descripcion : string // Descripcion del tipo de reservacion
 * @param cantidadLugaresDisponibles : number // Cantidad de lugares disponibles
 * @param valor : number // Valor del tipo de reservacion(Este valor no cambia)
 * @returns {boolean | string}
 */
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

/**
 * 
 * @param id : string // ID del documento a eliminar
 * @returns {boolean | string}
 */
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

//Funciones de menu
export const consultarMenu = async () => {

    try {

        const menuRef = await db.collection('menu');

        const query = await menuRef.get();

        const menu = query.docs.map(doc => {
            return {
                id: doc.id,
                descripcionPlatillo: doc.data().descripcionPlatillo,
                precio: doc.data().precio,
                imagen: doc.data().imagen
            }
        });

        return menu;
    } catch (error) {
        return 'Hubo un error en la base de datos';
    }
}


export const agregarPlatillo = async (
    descripcionPlatillo: string,
    precio: number,
    imagen: string
) => {

    try {

        const menuRef = await db.collection('menu');

        const query: boolean = await menuRef.add({
            descripcionPlatillo,
            precio,
            imagen
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

export const actualizarPlatillo = async (
    id: string,
    descripcionPlatillo: string,
    precio: number,
    imagen: string
) => {

    try {
        if (!id) {
            throw new Error('El platillo no tiene un ID válido');
        }

        const menuRef = await db.collection('menu').doc(id);

        const query = await menuRef.update({
            descripcionPlatillo,
            precio,
            imagen
        })
            .then(() => {
                return true;
            })
            .catch((err) => {
                return {
                    err: -1,
                    message: err
                };
            });

        return query;

    } catch (error) {
        return 'Hubo un error en la base de datos';
    }
}

export const eliminarPlatillo = async (id: string) => {

    try {

        const menuRef = await db.collection('menu').doc(id);

        const query = await menuRef.delete()
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
