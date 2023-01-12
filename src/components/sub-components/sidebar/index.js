import React from "react";
import "boxicons";
import { Link } from "react-router-dom";

function Sidebar(props) {
  let permissions = JSON.parse(localStorage.getItem("permissions"));
  let cu = permissions.crearUsuarios;
  let sh = permissions.horasIngreso;

  const createFunction = () => {
    if (cu) {
      return (
        <li className="nav-link">
          <Link to="/user">
            <div className="icon">
              <box-icon name="user" size="20px"></box-icon>
            </div>
            <span className="text nav-text">Usuarios</span>
          </Link>
        </li>
      );
    }
  };
  const hourFunction = () => {
    if (sh) {
      return (
        <li className="nav-link">
          <Link to="/update">
            <div className="icon">
              <box-icon name="time-five" size="20px"></box-icon>
            </div>
            <span className="text nav-text">Horarios</span>
          </Link>
        </li>
      );
    }
  };
  return (
    <div className="navDiv">
      <nav className="sidebar" id="sidebar">
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="caja-link ">
                <Link to="/home">
                  <div className="icon">
                    <box-icon name="home" size="20px"></box-icon>
                  </div>
                  <span className="text nav-text">Home</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/moves">
                  <div className="icon">
                    <box-icon name="heart" size="20px"></box-icon>
                  </div>
                  <span className="text nav-text">Movimientos</span>
                </Link>
              </li>
              {createFunction()}
              {hourFunction()}
            </ul>
          </div>
          <div className="bottom-content">
            <li className="nav-link">
              <Link to="/logout">
                <div className="icon">
                  <box-icon name="log-out" size="20px"></box-icon>
                </div>
                <span className="text nav-text">Logout</span>
              </Link>
            </li>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
