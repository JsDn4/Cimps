import axios from "axios";

export const eliminarPlatillo = async (
    id: string
) => {

    try {

        const res = await axios.post(`https://webbackend-gkg6hxe7lq-uc.a.run.app/EliminarPlatillo`, {
            id
        });

        if (res.status === 200) {
            return true;
        } else {
            return {
                err: -1,
                message: "Error al eliminar el platillo"
            };
        }

    } catch (error) {

        return {
            err: -1,
            message: "Error al eliminar el platillo"
        };

    }

}