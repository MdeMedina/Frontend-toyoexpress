import React from "react";
import Navg from "../sub-components/nav";
import { Link } from "react-router-dom";
import Sidebar from "../sub-components/sidebar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { frontUrl } from "../../lib/data/server";
function Home({ socket }) {
  const navigate = useNavigate();
  const key = localStorage.getItem("key");
  if (!key) {
    window.location.href = `${frontUrl()}/login`;
  }

  const permissions = JSON.parse(localStorage.getItem("permissions"));
  const hi = permissions.horasIngreso;
  const cu = permissions.crearUsuarios;

  return (
    <>
      <div class="row d-flex justify-content-center c-container">
        <div className="col-11">
          <h2>Bienvenido</h2>
        </div>
        <div className="col-4 row d-flex justify-content-center">
          <div class="card cd col-10 cl">
            <img
              src={require("../img/moves.jpg")}
              class="card-img-top "
              alt="..."
            />
            <div class="card-body ">
              <h5 class="card-title d-flex justify-content-center">
                Movimientos
              </h5>
              <p class="card-text d-flex justify-content-center">
                Crea, visualiza, elimina y edita, ingresos y egresos
              </p>
              <Link to="/moves" className="d-flex justify-content-center">
                <btn class="toyox">Entrar</btn>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-4 row d-flex justify-content-center">
          {!cu ? (
            false
          ) : (
            <div class="card cd col-10 cl">
              <img
                src={require("../img/users.jpg")}
                class="card-img-top cl"
                alt="..."
              />
              <div class="card-body ">
                <h5 class="card-title d-flex justify-content-center">
                  Usuarios
                </h5>
                <p class="card-text d-flex justify-content-center">
                  Crea, visualiza, elimina y edita usuarios
                </p>
                <Link to="/user" className="d-flex justify-content-center">
                  <btn class="toyox">Entrar</btn>
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="col-4 row d-flex justify-content-center">
          {!hi ? (
            false
          ) : (
            <div class="card cd col-10 cl">
              <img
                src={require("../img/hours.jpg")}
                class="card-img-top cl"
                alt="..."
              />
              <div class="card-body ">
                <h5 class="card-title d-flex justify-content-center">
                  Actualizar horas de ingreso
                </h5>
                <p class="card-text d-flex justify-content-center">
                  Actualiza las horas de ingreso de los usuarios a la aplicacion
                </p>
                <Link to="/update" className="d-flex justify-content-center">
                  <btn class="toyox">Entrar</btn>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
