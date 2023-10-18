import axios from "axios";
import { Menu } from "../types";

export const actualizarPlatillo = async (
    id: string,
    descripcionPlatillo: string,
    precio: number,
    imagen: string
) => {

    try {

        const platillo: Menu = {
            id,
            descripcionPlatillo,
            precio,
            imagen
        }

        const res = await axios.post(`https://webbackend-gkg6hxe7lq-uc.a.run.app/ActualizarPlatillo`,
            platillo
        );

        if (res.status === 200) {
            return true;
        } else {
            return res.data;
        }

    } catch (error) {

        return {
            error: error
        };

    }

}