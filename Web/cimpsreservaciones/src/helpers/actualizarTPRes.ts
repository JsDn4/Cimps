import axios from "axios";
import { TipoReservacion } from "../types";

export const actualizarTPRes = async (
    id: string,
    descripcion: string,
    cantidadLugaresDisponibles: number,
    valor: number
) => {
    try {

        const tipoReservacion: TipoReservacion = {
            id,
            descripcion,
            cantidadLugaresDisponibles,
            valor
        };

        const { data } = await axios.post(
            'https://webbackend-gkg6hxe7lq-uc.a.run.app/ActualizarTipoReservacion',
            tipoReservacion
        );

        return data;
    } catch (error) {

        console.log(error);

        return error;

    }
}   