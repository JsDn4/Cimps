import { FormCrearActualizarTipoReservacion } from "../components/FormCrearActualizarTipoReservacion"
import { Header } from "../components/Header"


export const CrearActualizarTPReservacion: React.FC = () => {

    const rutas = [
        {
            titulo: 'Reservaciones',
            tituloVista: 'Reservaciones'
        }
    ]

    return (
        <>
            <Header rutas={rutas} />

            <FormCrearActualizarTipoReservacion />

        </>
    )
}
