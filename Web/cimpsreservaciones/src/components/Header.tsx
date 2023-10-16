import { Link } from 'react-router-dom';

interface rutas {
    titulo: string;
    subruta?: string;
    tituloVista: string;
}

type HeaderProps = {
    rutas: Array<rutas>;
};


export const Header: React.FC<HeaderProps> = ({
    rutas
}) => {
    return (
        <>
            <header>
                <div className="contenedor">

                    <div className="contenedor-header">
                        <div>
                            <Link
                                to="/Home"
                                className="logo">
                                CIMPS
                            </Link>
                        </div>

                        <nav className="navbar">

                            {rutas.map((ruta, index) => (

                                <Link
                                    key={index}

                                    to={
                                        ruta.subruta
                                            ? `/${ruta.subruta}/${ruta.titulo}`
                                            : `/${ruta.titulo}`
                                    }
                                    className="navbar-item">
                                    {ruta.tituloVista}
                                </Link>
                            ))}


                        </nav>
                    </div>
                </div>
            </header >
        </>
    )
}
