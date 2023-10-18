import axios from "axios";

export const crearPlatillo = async (
    descripcionPlatillo: string,
    precio: number,
    imagen: string
) => {
    try {

        const platillo = {
            descripcionPlatillo,
            precio,
            imagen
        };

        const { data } = await axios.post(
            "https://webbackend-gkg6hxe7lq-uc.a.run.app/AgregarPlatillo",
            platillo
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};