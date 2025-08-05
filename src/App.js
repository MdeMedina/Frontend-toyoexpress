import React, {useEffect} from "react";
import Home from "./components/Home";
import Appx from "./components/template/app";
import { VentaProductos } from "./components/VentaPartes";
import { useIdleTimer } from 'react-idle-timer';
import User from "./components/User";
import Login from "./components/Login";
import Logout from "./components/Logout";
import UpdateHour from "./components/Hour";
import Moves from "./components/movimientos";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/home.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { backendUrl, frontUrl } from "./lib/data/server";
import { AccountConfig } from "./components/AccountConfig";
import VistaInventario from "./components/VentaPartes/vistaInventario";
import Pedidos from "./components/Pedidos";
const socket = io.connect(`${backendUrl()}`);
function App() {
  let permissions = JSON.parse(localStorage.getItem("permissions"));
  let vm;
  let am;
  let dm;
  let mu;
  let du;
  if (permissions === null) {
    vm = false;
    am = false;
    dm = false;
    mu = false;
    du = false;
  } else {
    vm = permissions.verMovimientos;
    am = permissions.aprobarMovimientos;
    dm = permissions.eliminarMovimientos;
    mu = permissions.modificarUsuarios;
    du = permissions.eliminarUsuarios;
  }

  const handleOnIdle = () => {
    console.log('Usuario inactivo, cerrando sesión...');
    localStorage.clear(); // o solo localStorage.removeItem('token');
    window.location.href =`${frontUrl()}/logout` // Redirigir a la página de logout
  };

  useIdleTimer({
    timeout: 60 * 60 * 1000, // 2 minutos
    onIdle: handleOnIdle,
    debounce: 500,
  });

  useEffect(() => {
    fetch('/version.json', { cache: 'no-store' })
      .then(res => res.json())
      .then(serverVersion => {
        const localVersion = localStorage.getItem('app_version');
  
        if (!localVersion || localVersion !== String(serverVersion.version)) {
          localStorage.setItem('app_version', serverVersion.version);
          window.location.reload(true); // Forzar recarga sin cache
        }
      })
      .catch(err => console.error('Error obteniendo versión:', err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pdf" element={<VistaInventario />} />
        <Route path="/" element={<Appx socket={socket} />}>
        <Route path="/registros" element={<Pedidos />} />
          <Route path="/update" element={<UpdateHour />} />
          <Route path="/products" element={<VentaProductos />} />
          <Route
            path="/accountConfig"
            element={<AccountConfig socket={socket} />}
          />
          <Route
            path="/moves"
            element={
              <Moves
                socket={socket}
                verMovimientos={vm}
                aprobarMovimientos={am}
                eliminarMovimientos={dm}
              />
            }
          />
          <Route
            path="/user"
            element={<User socket={socket} modUsuarios={mu} delUsuarios={du} />}
          />
          <Route path="/" element={<Home socket={socket} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
