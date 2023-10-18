import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '../types';
import { crearPlatillo } from '../helpers/crearPlatillo';
import { actualizarPlatillo } from '../helpers/actualizarPlatillo';

export const FormCrearActualizarPlatillo: React.FC = () => {

    let id: string;
    let descripcionPlatillo: string;
    let precio: number;
    let imagen: string;

    const navigate = useNavigate();

    try {

        const props = useLocation().state.platillo as Menu

        id = props?.id as string
        descripcionPlatillo = props?.descripcionPlatillo as string
        precio = props?.precio as number
        imagen = props?.imagen as string

    } catch (error) {

        id = ''
        descripcionPlatillo = ''
        precio = 0
        imagen = ''

    }

    const [platillo, setPlatillo] = React.useState<Menu>({
        id: id.toString(),
        descripcionPlatillo: descripcionPlatillo,
        precio: precio,
        imagen: imagen
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlatillo({
            ...platillo,
            [event.target.name]: event.target.type === 'number' ? Number(event.target.value) : event.target.value
        });
    }

    /**
     * Submit del formulario
     */

    const handleSumit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //Verificar si es crear o actualizar
        try {

            let res;

            if (id === '') {
                res = await crearPlatillo(
                    platillo.descripcionPlatillo,
                    Number(platillo.precio),
                    platillo.imagen
                );
            } else {
                res = await actualizarPlatillo(
                    platillo.id as string,
                    platillo.descripcionPlatillo as string,
                    Number(platillo.precio) as number,
                    platillo.imagen as string
                );
            }

            if (res.err === 0) {
                navigate('/Menu');
            } else {
                navigate('/Menu');
            }

        } catch (error) {

            console.log(error);

        }
    }




    return (
        <>

            <form onSubmit={handleSumit}>

                <div className="form-group">
                    <label htmlFor="descripcionPlatillo">Descripcion</label>
                    <input
                        type="text"
                        className="form-control"
                        id="descripcionPlatillo"
                        name="descripcionPlatillo"
                        value={platillo.descripcionPlatillo}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="precio">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        id="precio"
                        name="precio"
                        value={Number(platillo.precio)}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="imagen">Imagen</label>
                    <input
                        type="text"
                        className="form-control"
                        id="imagen"
                        name="imagen"
                        value={platillo.imagen}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="btn btn-verde">Guardar</button>

            </form>

        </>
    )
}
