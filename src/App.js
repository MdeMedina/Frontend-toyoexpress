import React, {useEffect, useState} from 'react'
import Login from './components/Login'
import './css/login.css';
import { url_api } from './lib/data/server.js';
import {BrowserRouter as Router, Switch, Route, Link}  from 'react-router-dom'
function App() {
  const [backendData, setBackendData] = useState([{}])
  useEffect (() => {
  

    fetch(`${url_api}/users/`).then(
      response => response.json()
    ).then(
      data => setBackendData(data)
    ).then(
      data => console.log(data)
    )
  }, [])
  return (
   <Router>
    <Switch>
      <Route path="/login" ><Login /></Route> 
    </Switch>
   </Router>
    );
}

export default App;
