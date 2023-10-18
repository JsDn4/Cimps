import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import * as vista from './views'

export const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/Home" Component={vista.Home} />

          <Route path="/Reservaciones" Component={vista.ReservacionesView} />
          <Route path="/Reservaciones/TipoDeReservacion" Component={vista.TipoDeReservacionView} />
          <Route path="/Reservaciones/TipoDeReservacion/Actualizar" Component={vista.CrearActualizarTPReservacion} />
          <Route path="/Reservaciones/TipoDeReservacion/AgregarTipoReservacion" Component={vista.CrearActualizarTPReservacion} />

          <Route path="/Menu" Component={vista.MenuView} />
          <Route path='/Menu/AgregarPlatillo' Component={vista.CrearActualizarPlatilloView} />
          <Route path='/Menu/ActualizarPlatillo' Component={vista.CrearActualizarPlatilloView} />
        </Routes>
      </Router>

    </>
  )
}

