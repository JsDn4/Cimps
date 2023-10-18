import { FormCrearActualizarTipoReservacion } from "../components/FormCrearActualizarTipoReservacion"
import { Header } from "../components/Header"
import { rutas } from "../types"


export const CrearActualizarTPReservacion: React.FC = () => {

    const rutasHeader: rutas = [
        {
            titulo: 'Reservaciones',
            tituloVista: 'Reservaciones'
        }
    ]

    return (
        <>
            <Header rutas={rutasHeader} />

            <FormCrearActualizarTipoReservacion />

        </>
    )
}
