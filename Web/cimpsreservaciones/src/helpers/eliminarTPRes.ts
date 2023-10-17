import axios from "axios";

export const eliminarTPRes = async (
    id: string
) => {
    try {


        const { data } = await axios.post(
            'https://webbackend-gkg6hxe7lq-uc.a.run.app/EliminarTipoReservacion',
            { id }
        );

        return data;
    } catch (error) {

        console.log(error);

        return error;

    }
}