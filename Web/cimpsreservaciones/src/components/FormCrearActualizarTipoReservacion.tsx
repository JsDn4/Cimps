import { useLocation, useNavigate } from "react-router-dom";
import { TipoReservacion } from "../types"
import React, { useState } from 'react';
import { crearTipoReservacion } from "../helpers/crearTipoReservacion";
import { actualizarTPRes } from "../helpers/actualizarTPRes";


export const FormCrearActualizarTipoReservacion: React.FC = () => {

    let id: string;
    let descripcion: string;
    let cantidadLugaresDisponibles: number;
    let valor: number;

    const navigate = useNavigate();

    try {

        const props = useLocation().state.tipoReservacion as TipoReservacion

        id = props?.id as string
        descripcion = props?.descripcion as string
        cantidadLugaresDisponibles = props?.cantidadLugaresDisponibles as number
        valor = props?.valor as number

    } catch (error) {

        id = ''
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

    /**
     * Submit del formulario
     */


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //Verificar si es crear o actualizar
        try {

            let res;

            if (tipoReservacion !== undefined && tipoReservacion.id !== '') {
                res = await actualizarTPRes(
                    tipoReservacion.id as string,
                    tipoReservacion.descripcion as string,
                    tipoReservacion.cantidadLugaresDisponibles as number,
                    Number(tipoReservacion.valor) as number
                );

            } else {
                res = await crearTipoReservacion(
                    tipoReservacion.descripcion as string,
                    Number(tipoReservacion.cantidadLugaresDisponibles) as number,
                );
            }

            if (res) {
                navigate('/Reservaciones/TipoDeReservacion');
            }

        } catch (error) {

            console.log(error);

        }

    };



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
