import React from 'react'
import Home from './components/Home'
import Caja from './components/Caja'
import User from './components/User'
import Login from './components/Login'
import Logout from './components/Logout'
import UpdateHour from './components/Hour'
import Moves from './components/movimientos'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route }  from 'react-router-dom'
import io from 'socket.io-client'
import { url_api } from './lib/data/server'
const socket = io.connect(`${url_api}`);
function App() {
 let permissions = JSON.parse(localStorage.getItem('permissions'))
 let vm;
 let am;
 let dm;
 let mu;
 let du
 if (permissions === null) {
  vm = false
am = false
dm = false
 mu = false
 du = false
 } else {
   vm = permissions.verMovimientos
    am = permissions.aprobarMovimientos
    dm = permissions.eliminarMovimientos
    mu = permissions.modificarUsuarios
    du = permissions.eliminarUsuarios
 }

  return (
   <Router>
    <Switch>
      <Route path="/logout"><Logout /></Route>
      <Route path="/login" ><Login /></Route> 
      <Route path="/update" ><UpdateHour /></Route> 
      <Route path="/caja" ><Caja socket={socket} /></Route> 
      <Route path="/moves" ><Moves socket={socket} verMovimientos={vm} aprobarMovimientos={am} eliminarMovimientos={dm}/></Route> 
      <Route path="/user" ><User socket={socket} modUsuarios={mu} delUsuarios={du}/></Route> 
      <Route path="/" ><Home socket={socket}/></Route> 
    </Switch>
   </Router>
    );
}

export default App;
