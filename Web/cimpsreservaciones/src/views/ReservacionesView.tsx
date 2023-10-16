import { Header } from "../components/Header"

export const ReservacionesView: React.FC = () => {

    const rutasHeader = [
        { titulo: "Menu", subruta: "Reservaciones", tituloVista: "Menu" },
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
