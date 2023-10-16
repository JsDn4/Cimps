import { obtenerTiposReservaciones } from '../helpers/obtenerReservaciones';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TipoReservacion } from '../types';


export const TiposReservacionGrid: React.FC = () => {

    const [tiposReservacion, setTiposReservacion] = useState<Array<TipoReservacion>>()

    //Obtener los tipos de reservacion useEfect

    const fetchTipoReservacion = async () => {
        const resp = await obtenerTiposReservaciones();
        return resp;
    };

    //Eliminar tipo de reservacion
    //Recibir el evento del boton eliminar
    const handleConfirmarEliminar = (event: React.MouseEvent) => {
        event.preventDefault();

        const confirmacion = window.confirm('¿Está seguro de eliminar el tipo de reservacion?');

        if (confirmacion) {
            console.log('Se elimino el tipo de reservacion');

            window.location.reload();
        }
    }

    useEffect(() => {
        fetchTipoReservacion().then(setTiposReservacion);
    }, []);

    return (
        <>
            <table className='contenedor tabla'>

                <thead>
                    <tr>
                        <th>Descripcion</th>
                        <th>Cantidad de lugares disponibles</th>
                        <th>Valor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        tiposReservacion?.map((tipoReservacion) => (
                            <tr key={tipoReservacion.id}>
                                <td>{tipoReservacion.descripcion}</td>
                                <td>{tipoReservacion.cantidadLugaresDisponibles}</td>
                                <td>{tipoReservacion.valor}</td>
                                <td className='separacion-flex'>
                                    <button
                                        className='boton boton-rojo'
                                        onClick={handleConfirmarEliminar}
                                    >
                                        Eliminar
                                    </button>

                                    <Link
                                        to={`/Reservaciones/TipoDeReservacion/Actualizar`}
                                        state={{ tipoReservacion }}
                                        className='boton boton-verde'>
                                        Actualizar
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>

            </table >
        </>

    )
}
