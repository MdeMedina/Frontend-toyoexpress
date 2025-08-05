import React from 'react'
import Home from "./Home";
import Caja from "./Caja";
import User from "./User";
import UpdateHour from "./Hour";
import Moves from "./movimientos";
import { AccountConfig } from "./AccountConfig";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { frontUrl } from '../lib/data/server';

function InApp ({socket, vm, am, dm, mu, du}) {
  const key = localStorage.getItem("token");
   if (!key) {
      window.location.href = `${frontUrl()}/logout`;
    } 
  return (
    <>
    <Router>
    <Switch>
    <Route path="/update">
          <UpdateHour />
        </Route>
        <Route path="/accountConfig">
          <AccountConfig socket={socket} />
        </Route>
        <Route path="/caja">
          <Caja socket={socket} />
        </Route>
        <Route path="/moves">
          <Moves
            socket={socket}
            verMovimientos={vm}
            aprobarMovimientos={am}
            eliminarMovimientos={dm}
          />
        </Route>
        <Route path="/user">
          <User socket={socket} modUsuarios={mu} delUsuarios={du} />
        </Route>
        <Route path="/">
          <Home socket={socket} />
        </Route>
    </Switch>
    </Router>
    </>
  )
}

export default InApp
