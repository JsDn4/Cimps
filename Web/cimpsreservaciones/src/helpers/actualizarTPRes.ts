import axios from "axios";
import { TipoReservacion } from "../types";

export const actualizarTPRes = async (tipoReservacion: TipoReservacion) => {
    try {

        const { data } = await axios.post(
            'https://webbackend-gkg6hxe7lq-uc.a.run.app/horarios/ActualizarTipoReservacion',
            tipoReservacion
        );

        return data;
    } catch (error) {

        console.log(error);

        return error;

    }
}   