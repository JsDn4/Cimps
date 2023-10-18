import { Header } from '../components/Header';
import { MenuGrid } from '../components/MenuGrid';
import { rutas } from '../types';
export const MenuView: React.FC = () => {

    const rutasHeader: rutas = [


        {
            titulo: "Menu",
            tituloVista: "Menu"
        },
        {
            titulo: "Reservaciones",
            tituloVista: "Reservaciones"
        },
        {
            titulo: "AgregarPlatillo",
            tituloVista: "Agregar platillo",
            subruta: "Menu"
        }

    ]

    return (
        <>
            <Header rutas={rutasHeader} />
            <h2>Menu</h2>

            <MenuGrid />

        </>
    )
}
