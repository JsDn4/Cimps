import axios from "axios";

export const obtenerHorarios = async () => {
    try {
        const respuesta = (await axios.get('https://webbackend-gkg6hxe7lq-uc.a.run.app/horarios')).data

        const { horarios } = respuesta;

        return horarios;

    } catch (error) {

        return {
            err: -1,
            message: 'Hubo un error en la base de datos'
        };

    }
};