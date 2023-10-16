import { Header } from "../components/Header"

export const Home: React.FC = () => {

    const rutasHome = [
        { titulo: "Home", tituloVista: "Home" },
        { titulo: "Reservaciones", tituloVista: "Reservaciones" },
    ]

    return (
        <>
            <Header rutas={rutasHome} />

            <div className="centrar-h-v">
                <h4>Home</h4>
            </div>

        </>
    )
}
