import React from "react";
import Home from "./components/Home";
import Appx from "./components/template/app";
import User from "./components/User";
import Login from "./components/Login";
import Logout from "./components/Logout";
import UpdateHour from "./components/Hour";
import Moves from "./components/movimientos";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import io from "socket.io-client";
import { url_api } from "./lib/data/server";
import { AccountConfig } from "./components/AccountConfig";
const socket = io.connect(`${url_api}`);
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

  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />}/>
        <Route path='/' element={<Appx socket={socket}/>} >
        <Route path="/update" element={<UpdateHour />}/>
        <Route path="/accountConfig" element={<AccountConfig socket={socket} />} />
        <Route path="/moves" element={          <Moves
            socket={socket}
            verMovimientos={vm}
            aprobarMovimientos={am}
            eliminarMovimientos={dm}
          />} />
        <Route path="/user" element={<User socket={socket} modUsuarios={mu} delUsuarios={du} />} />
        <Route path="/" element={<Home socket={socket} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
