import React from 'react'
import { Header } from '../components/Header';
import { rutas } from '../types';
import { FormCrearActualizarPlatillo } from '../components/FormCrearActualizarPlatillo';

export const CrearActualizarPlatilloView: React.FC = () => {

    const rutas: rutas = [
        { titulo: 'Menu', tituloVista: 'Menu' },
        { titulo: 'Reservaciones', tituloVista: 'Reservaciones' },
    ]


    return (
        <>
            <Header rutas={rutas} />

            <FormCrearActualizarPlatillo />
        </>
    )
}
