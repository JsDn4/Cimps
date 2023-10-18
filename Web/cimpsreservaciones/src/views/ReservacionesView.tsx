import { Header } from "../components/Header"
import { rutas } from "../types"

export const ReservacionesView: React.FC = () => {

    const rutasHeader: rutas = [
        { titulo: "Menu", tituloVista: "Menu" },
        { titulo: "TipoDeReservacion", subruta: "Reservaciones", tituloVista: "Tipo de reservacion" }
    ]

    return (
        <>
            <Header rutas={rutasHeader} />

            <div className="centrar-h-v">
                <h4>Reservaciones</h4>
            </div>

        </>
    )
}
