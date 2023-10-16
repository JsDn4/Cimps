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
        </Routes>
      </Router>

    </>
  )
}

