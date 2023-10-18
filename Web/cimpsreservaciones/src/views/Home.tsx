import { Header } from "../components/Header"
import { rutas } from "../types"

export const Home: React.FC = () => {

    const rutasHeader: rutas = [
        { titulo: "Home", tituloVista: "Home" },
        { titulo: "Reservaciones", tituloVista: "Reservaciones" },
        { titulo: "Menu", tituloVista: "Menu" }
    ]

    return (
        <>
            <Header rutas={rutasHeader} />

            <div className="centrar-h-v">
                <h4>Home</h4>
            </div>

        </>
    )
}
