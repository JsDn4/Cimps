import axios from "axios";
import { TipoReservacion } from "../types";

export const crearTipoReservacion = async (
    descripcion: string,
    cantidadLugaresDisponibles: number
) => {
    try {

        const tipoReservacion: TipoReservacion = {
            descripcion,
            cantidadLugaresDisponibles
        };

        const { data } = await axios.post(
            'https://webbackend-gkg6hxe7lq-uc.a.run.app/AgregarTipoReservacion',
            tipoReservacion
        );

        return data;
    } catch (error) {

        console.log(error);

        return error;

    }
}

