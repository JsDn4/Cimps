import { useEffect, useState } from 'react';
import { obtenerMenu } from '../helpers/obtenerMenu';
import { Link } from 'react-router-dom';
import { Menu } from '../types';
import { eliminarPlatillo } from '../helpers/eliminarPlatillo';



export const MenuGrid: React.FC = () => {

    const [menu, setMenu] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(false);


    const handleObtenerMenu = async () => {
        try {

            const data = await obtenerMenu();
            return data;

        } catch (error) {

            return {
                err: -1,
                message: "Error al obtener el menu"
            };

        }
    }

    const handleConfirmarEliminar = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.id;
        const confirmacion = window.confirm('¿Está seguro de eliminar el platillo?');

        if (confirmacion) {
            //Eliminar

            const resp = await eliminarPlatillo(id);

            const resp2 = await handleObtenerMenu();

            setMenu(resp2);

            return resp;
        }
    }

    useEffect(() => {

        setLoading(true);

        handleObtenerMenu().then((data) => {
            setMenu(data);
            setLoading(false);
        });

    }, []);

    return (
        <>
            {loading && <div className="alert alert-info text-center">Cargando...</div>}

            <table className='contenedor tabla'>
                <thead>
                    <tr>
                        <th>imagen</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                        <th>Acciones</th>

                    </tr>
                </thead>

                <tbody>

                    {
                        menu.map((platillo) => (
                            <tr key={platillo.id}>
                                <td>
                                    <img className='img-tabla' src={platillo.imagen} alt={platillo.descripcionPlatillo} />
                                </td>
                                <td>{platillo.descripcionPlatillo}</td>
                                <td>{platillo.precio}</td>

                                <td className='separacion-flex'>
                                    <button
                                        id={platillo.id}
                                        className='boton boton-rojo'
                                        onClick={handleConfirmarEliminar}
                                    >
                                        Eliminar
                                    </button>

                                    <Link
                                        to={`/Menu/ActualizarPlatillo`}
                                        state={{ platillo }}
                                        className='boton boton-verde'>
                                        Actualizar
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>

            </table>
        </>
    )
}
