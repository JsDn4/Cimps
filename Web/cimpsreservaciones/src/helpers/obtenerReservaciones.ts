import axios from "axios";

export const obtenerTiposReservaciones = async () => {
    try {
        const respuesta = (await axios.get('https://webbackend-gkg6hxe7lq-uc.a.run.app/tiposDeReservacion')).data

        const { tiposDeReservacion } = respuesta;

        return tiposDeReservacion;

    } catch (error) {

        return {
            err: -1,
            message: 'Hubo un error en la base de datos'
        };

    }
};