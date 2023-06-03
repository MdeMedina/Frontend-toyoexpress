import React from "react";
import "boxicons";
import { Link } from "react-router-dom";

function Sidebar(props) {
  let permissions = JSON.parse(localStorage.getItem("permissions"));
  let cu = permissions.crearUsuarios;
  let sh = permissions.horasIngreso;
  let ca = permissions.configurarCuentas;

  const createFunction = () => {
    if (cu) {
      return (
        <li className="nav-link">
          <Link to="/user">
            <div className="icon">
              <box-icon type="solid" name="user-account" size="27px"></box-icon>
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
              <box-icon name="timer" size="27px"></box-icon>
            </div>
            <span className="text nav-text">Horarios</span>
          </Link>
        </li>
      );
    }
  };

  const accountFunction = () => {
    if (ca) {
      return (
        <li className="nav-link">
          <Link to="/accountConfig">
            <div className="icon">
              <box-icon name="money"></box-icon>
            </div>
            <span className="text nav-text">Configuracion de cuentas</span>
          </Link>
        </li>
      );
    }
  };
  return (
    <>
      <nav className="sidebar" id="sidebar">
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="caja-link ">
                <Link to="/">
                  <div className="icon">
                    <box-icon name="home-smile" size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Home</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/moves">
                  <div className="icon">
                    <box-icon name="money-withdraw" size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Movimientos</span>
                </Link>
              </li>
              <li className="nav-link">
                <Link to="/products">
                  <div className="icon">
                    <box-icon name="store-alt" size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Listado</span>
                </Link>
              </li>
              {createFunction()}
              {hourFunction()}
              {accountFunction()}
            </ul>
          </div>
          <div className="bottom-content">
            <li className="nav-link">
              <Link to="/logout">
                <div className="icon">
                  <box-icon name="log-out" size="27px"></box-icon>
                </div>
                <span className="text nav-text">Logout</span>
              </Link>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
