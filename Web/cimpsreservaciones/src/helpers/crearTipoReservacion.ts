import axios from "axios";
import { TipoReservacion } from "../types";

export const crearTipoReservacion = async (tipoReservacion: TipoReservacion) => {
    try {

        const { data } = await axios.post(
            'https://webbackend-gkg6hxe7lq-uc.a.run.app/horarios/AgregarTipoReservacion',
            tipoReservacion
        );

        return data;
    } catch (error) {

        console.log(error);

        return error;

    }
}

