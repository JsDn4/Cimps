import { Header } from "../components/Header"
import { TiposReservacionGrid } from '../components/TiposReservacionGrid';

export const TipoDeReservacionView: React.FC = () => {

    const rutasTipoDeReservacion = [
        { titulo: "Menu", subruta: "Reservaciones", tituloVista: "Menu" },
        { titulo: "AgregarTipoReservacion", subruta: "Reservaciones/TipoDeReservacion", tituloVista: "Agregar tipo de reservacion" }
    ]

    return (
        <>
            <Header rutas={rutasTipoDeReservacion} />
            <h5>Tipo de reservacion</h5>

            <TiposReservacionGrid />
        </>
    )
}
