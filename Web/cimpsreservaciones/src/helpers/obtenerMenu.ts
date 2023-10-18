import axios from "axios";

export const obtenerMenu = async () => {
    try {

        const respuesta = (await axios.get("https://webbackend-gkg6hxe7lq-uc.a.run.app/Menu")).data;
        return respuesta.menu;

    } catch (error) {

        return {
            err: -1,
            message: "Error al obtener el menu"
        };

    }
};