import { obtenerTiposReservaciones } from '../helpers/obtenerReservaciones';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TipoReservacion } from '../types';
import { eliminarTPRes } from '../helpers/eliminarTPRes';


export const TiposReservacionGrid: React.FC = () => {

    const [tiposReservacion, setTiposReservacion] = useState<Array<TipoReservacion>>()

    //Obtener los tipos de reservacion useEfect

    const fetchTipoReservacion = async () => {
        const resp = await obtenerTiposReservaciones();
        return resp;
    };

    //Eliminar tipo de reservacion
    //Recibir el evento del boton eliminar
    const handleConfirmarEliminar = async (event: React.MouseEvent) => {
        event.preventDefault();

        try {

            const id = event.currentTarget.id;
            const confirmacion = window.confirm('¿Está seguro de eliminar el tipo de reservación?');

            if (confirmacion) {
                //Eliminar
                const resp = await eliminarTPRes(id);


                //Actualizar la tabla
                const resp2 = await fetchTipoReservacion();
                setTiposReservacion(resp2);

                return resp;

                // console.log(resp);
            }



        } catch (error) {

            return error;

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
                                        id={tipoReservacion.id}
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
