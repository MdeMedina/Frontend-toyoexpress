import React, { useState } from "react";
import "boxicons";
import { Link } from "react-router-dom";
import ModalComponent from "../modal/iframeModal";

function Sidebar(props) {
  const token = localStorage.getItem("token");
  let cp = false;
  let vm = false;
  let cu = false;
  let sh = false;
  let ca = false;
  if (token) {
    let permissions = JSON.parse(localStorage.getItem("permissions"));
    cp = permissions.consultarPrecios;
    vm = permissions.verMovimientos;
    cu = permissions.crearUsuarios;
    sh = permissions.horasIngreso;
    ca = permissions.configurarCuentas;
  } 

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
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

  const listaFunction = () => {
    if (cp) {
      return (
        <li className="nav-link">
          <Link to="/products">
            <div className="icon">
              <box-icon name="store-alt" size="27px"></box-icon>
            </div>
            <span className="text nav-text">Listado</span>
          </Link>
        </li>
      );
    }
  };
  const movesFunction = () => {
    if (vm) {
      return (
        <li className="nav-link">
          <Link to="/moves">
            <div className="icon">
              <box-icon name="money-withdraw" size="27px"></box-icon>
            </div>
            <span className="text nav-text">Movimientos</span>
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
              {listaFunction()}
              <li className="caja-link ">
                <Link to="/registros">
                  <div className="icon">
                    <box-icon name='file-pdf' type='solid' size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Pedidos Hechos</span>
                </Link>
              </li>
              {movesFunction()}
              {createFunction()}
              {hourFunction()}
              {accountFunction()}
              <li className="nav-link" onClick={handleShowModal}>
                <Link to="#">
                  <div className="icon">
                    <box-icon name="map" size="27px"></box-icon>
                  </div>
                  <span className="text nav-text">Mapa</span>
                </Link>
              </li>
            </ul>
          </div>
          <ModalComponent show={showModal} handleClose={handleCloseModal} />
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
