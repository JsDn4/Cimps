import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import * as express from 'express';
import * as cors from 'cors';
import { agregarTipoDeReservacion, consultarReservacionesDelDia, consultarTiposDeReservacion } from "./helpers/db";


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
        const { descripcion, cantidadLugaresDisponibles, valor } = req.body;

        const fetch = await agregarTipoDeReservacion({ descripcion, cantidadLugaresDisponibles, valor });

        res.status(200).send({
            fetch
        });

    } catch (error) {
        res.status(500).send({
            mensaje: 'Hubo un error en la base de datos'
        });
    }

});


exports.webBackend = onRequest(backendDev);



