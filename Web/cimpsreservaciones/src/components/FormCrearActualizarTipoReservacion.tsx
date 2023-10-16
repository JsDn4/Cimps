import { useLocation, useNavigate } from "react-router-dom";
import { TipoReservacion } from "../types"
import { useEffect, useState } from 'react';
import { crearTipoReservacion } from "../helpers/crearTipoReservacion";
import { actualizarTPRes } from "../helpers/actualizarTPRes";


export const FormCrearActualizarTipoReservacion: React.FC = () => {

    let id;
    let descripcion;
    let cantidadLugaresDisponibles;
    let valor;

    const navigate = useNavigate();


    const [submit, setSubmit] = useState<number>(0);

    try {

        const props = useLocation().state.tipoReservacion as TipoReservacion

        id = props?.id as string
        descripcion = props?.descripcion as string
        cantidadLugaresDisponibles = props?.cantidadLugaresDisponibles as number
        valor = props?.valor as number

    } catch (error) {

        id = 0
        descripcion = ''
        cantidadLugaresDisponibles = 0
        valor = 0

    }

    const [tipoReservacion, setTipoReservacion] = useState<TipoReservacion>({
        id: id.toString(),
        descripcion: descripcion,
        cantidadLugaresDisponibles: cantidadLugaresDisponibles,
        valor: valor
    });


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoReservacion({
            ...tipoReservacion,
            [event.target.name]: event.target.type === 'number' ? Number(event.target.value) : event.target.value
        });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setSubmit((submitPrevio) => submitPrevio + 1);
    }

    useEffect(() => {

        const redirect = () => {
            navigate('/Reservaciones/TipoDeReservacion');
        }

        const handleEnviarData = async () => {

            if (tipoReservacion.id !== '0') {
                await actualizarTPRes(tipoReservacion);
            } else {
                await crearTipoReservacion(tipoReservacion);
            }

            redirect();

            return

        }

        const handleFormSubmit = async () => {
            if (submit === 1) {
                await handleEnviarData();
            } else if (submit > 1) {
                redirect();
            }
        }

        handleFormSubmit();

    }, [navigate, submit, tipoReservacion])



    return (
        <>

            <form method="post" onSubmit={handleSubmit}>

                <div className='contenedor'>
                    <div className='contenedor-formulario'>
                        <h4 className='titulo-formulario'>
                            {
                                tipoReservacion.id ? 'Actualizar tipo de reservacion' : 'Crear tipo de reservacion'
                            }

                        </h4>

                        <div className='contenedor-input'>
                            <label htmlFor='descripcion'>Descripcion</label>
                            <input
                                type='text'
                                name='descripcion'
                                id='descripcion'
                                placeholder='Descripcion'
                                value={tipoReservacion.descripcion}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='contenedor-input'>
                            <label htmlFor='cantidadLugaresDisponibles'>Cantidad de lugares disponibles</label>
                            <input
                                type='number'
                                name='cantidadLugaresDisponibles'
                                id='cantidadLugaresDisponibles'
                                placeholder='Cantidad de lugares disponibles'
                                value={Number(tipoReservacion.cantidadLugaresDisponibles)}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='contenedor-input'>
                            <label htmlFor='valor'>Valor</label>
                            <input
                                type='number'
                                name='valor'
                                id='valor'
                                placeholder='Valor'
                                value={Number(tipoReservacion.valor)}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='contenedor-input'>

                            <button
                                className='boton boton-verde'
                                type='submit'
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>

            </form>


        </>
    )
}
