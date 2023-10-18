import { Header } from "../components/Header"
import { TiposReservacionGrid } from '../components/TiposReservacionGrid';
import { rutas } from "../types";

export const TipoDeReservacionView: React.FC = () => {

    const rutasHeader: rutas = [
        { titulo: "Menu", tituloVista: "Menu" },
        { titulo: "AgregarTipoReservacion", subruta: "Reservaciones/TipoDeReservacion", tituloVista: "Agregar tipo de reservacion" }
    ]

    return (
        <>
            <Header rutas={rutasHeader} />
            <h5>Tipo de reservacion</h5>

            <TiposReservacionGrid />
        </>
    )
}
