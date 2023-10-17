import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as express from 'express';
import * as cors from 'cors';
import {
    actualizarTipoDeReservacion,
    agregarTipoDeReservacion,
    consultarReservacionesDelDia,
    consultarTiposDeReservacion,
    eliminarTipoDeReservacion
} from "./helpers/db";


const backendDev = express();

backendDev.use(express.json());
backendDev.use(cors());


backendDev.get('/reservaciones', async (req, res) => {

    try {

        const reservaciones = await consultarReservacionesDelDia();

        res.status(200).send({
            reservaciones
        });

    } catch (error) {
        res.status(500).send({
            mensaje: 'Hubo un error en la base de datos'
        });
    }

});

backendDev.get('/TiposDeReservacion', async (req, res) => {

    try {

        const tiposDeReservacion = await consultarTiposDeReservacion();

        res.status(200).send({
            tiposDeReservacion
        });

    } catch (error) {
        res.status(500).send({
            mensaje: 'Hubo un error en la base de datos'
        });
    }

});

backendDev.post('/AgregarTipoReservacion', async (req, res) => {

    try {
        const { descripcion, cantidadLugaresDisponibles } = req.body;

        const fetch: boolean | string = await agregarTipoDeReservacion(descripcion, cantidadLugaresDisponibles);

        if (fetch === false) {
            res.status(400).send('Ocurrio un error al agregar el tipo de reservacion');
            return;
        } else if (fetch === true) {

            res.status(200).send({
                fetch
            });

        } else {

            res.status(400).send({
                fetch
            });

        }

    } catch (error) {
        res.status(500).send({
            mensaje: 'Hubo un error en la base de datos'
        });
    }

});


backendDev.post('/ActualizarTipoReservacion', async (req, res) => {

    try {
        const { id, descripcion, cantidadLugaresDisponibles, valor } = req.body;

        const fetch: boolean | string = await actualizarTipoDeReservacion(
            id,
            descripcion,
            cantidadLugaresDisponibles,
            valor
        );

        if (fetch === false) {
            res.status(400).send('Ocurrio un error al agregar el tipo de reservacion');
            return;
        } else if (fetch === true) {

            res.status(200).send({
                fetch
            });

        } else {

            res.status(400).send({
                fetch
            });

        }

    } catch (error) {
        res.status(500).send({
            mensaje: 'Hubo un error en la base de datos'
        });
    }

});

backendDev.post('/EliminarTipoReservacion', async (req, res) => {

    try {
        const { id } = req.body;

        const fetch: boolean | string = await eliminarTipoDeReservacion(id);

        if (fetch === false) {
            res.status(400).send('Ocurrio un error al agregar el tipo de reservacion');
            return;
        } else if (fetch === true) {

            res.status(200).send({
                fetch
            });

        } else {

            res.status(400).send({
                fetch
            });

        }

    } catch (error) {
        res.status(500).send({
            mensaje: 'Hubo un error en la base de datos'
        });
    }

})

exports.webBackend = onRequest(backendDev);



